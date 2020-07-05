/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const async = require('async');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const Menu = require('../models/menu.model');
const menuItemService = require('./menuItem.service');
const displayTextService = require('./displayText.service');
const ApiError = require('../utils/ApiError');
const userDataService = require('./userData.service');
const userSessionService = require('./userSession.service');
const ussdUserService = require('./ussdUser.service');

let allMenuItems; // Testing
let allDisplayText;

function buildMenu(menuCode) {
  const _menu = new Menu(menuCode);
  allMenuItems.forEach((menuItem) => {
    let displayText = {};
    if (menuItem.parentCode !== undefined) {
      if (menuItem.parentCode === menuCode) {
        allDisplayText.forEach((dt) => {
          if (menuItem.displayText !== undefined) {
            if (menuItem.displayText.equals(dt._id)) {
              displayText = dt;
            }
          }
        });
        _menu.addMenuElements(menuItem, displayText);
      }
    }
  });
  return _menu;
}
async function buildMenuAsync(menuCode) {
  const allMenuItemsPromise = menuItemService.getMenuItems();
  const allDisplayTextPromise = displayTextService.getDisplayTexts();
  const _menu = new Menu(menuCode);
  return Promise.all([allMenuItemsPromise, allDisplayTextPromise]).then((values) => {
    allMenuItems = values[0];
    allDisplayText = values[1];
    allMenuItems.forEach((menuItem) => {
      let displayText = {};
      if (menuItem.parentCode !== undefined) {
        if (menuItem.parentCode === menuCode) {
          allDisplayText.forEach((dt) => {
            if (menuItem.displayText !== undefined) {
              if (menuItem.displayText.equals(dt._id)) {
                displayText = dt;
              }
            }
          });
          _menu.addMenuElements(menuItem, displayText);
        }
      }
    });
    return _menu;
  });
}

function getChildMenusFromMI(parent, menuSet) {
  if (parent.menuElements) {
    parent.menuElements.forEach((menuElement) => {
      if (menuElement.menuItem.code) {
        const newMenu = buildMenu(menuElement.menuItem.code);
        if (newMenu.menuElements.length !== 0) {
          menuSet.push(newMenu);
        }
      }
    });
  }
}

function getMenuSets(endOfFullMenuTree) {
  const menuSet = [];
  endOfFullMenuTree.forEach((parentMenu) => {
    getChildMenusFromMI(parentMenu, menuSet);
  });
  return menuSet;
}

function getParentmenu(menuItem, parentMenu) {
  let displayText = {};
  if (menuItem.parentCode === '0') {
    allDisplayText.forEach((dt) => {
      if (menuItem.displayText !== undefined) {
        if (menuItem.displayText.equals(dt._id)) {
          displayText = dt;
        }
      }
    });
    parentMenu.addMenuElements(menuItem, displayText);
  }
}
const getFullMenuSet = async () => {
  const fullMenuTree = [];
  let containsChildMenuSets = true;
  const allMenuItemsPromise = menuItemService.getMenuItems();
  const allDisplayTextPromise = displayTextService.getDisplayTexts();
  let lastMenuSet = [];
  await Promise.all([allMenuItemsPromise, allDisplayTextPromise]).then((values) => {
    allMenuItems = values[0];
    allDisplayText = values[1];
    const parentMenu = new Menu('0');
    allMenuItems.forEach((menuItem) => {
      getParentmenu(menuItem, parentMenu);
    });
    if (parentMenu.menuElements.length === 0) {
      return [];
    }
    fullMenuTree.push([parentMenu]);
    while (containsChildMenuSets) {
      lastMenuSet = fullMenuTree[fullMenuTree.length - 1];
      const newChildMenuSet = getMenuSets(lastMenuSet);
      if (newChildMenuSet.length === 0) {
        containsChildMenuSets = false;
      } else {
        fullMenuTree.push(newChildMenuSet);
      }
    }
  });
  return fullMenuTree;
};
const saveFullMenuSet = async (fullMenuSet) => {
  if (fullMenuSet === undefined || fullMenuSet.length === 0) {
    return [];
  }
  let dtPromise;
  let mePromise;
  async.whilst(
    function test(callback) {
      callback(null, fullMenuSet.length > 0);
    },
    function iter(callback) {
      const menu = fullMenuSet.pop();
      menu.forEach((mn) => {
        mn.menuElements.forEach((me) => {
          if (me.displayTexts._id === undefined) {
            // save
            dtPromise = displayTextService.createDisplayText(me.displayTexts);
          } else {
            dtPromise = displayTextService.updateDisplayTextById(me.displayTexts._id, me.displayTexts);
          }
          dtPromise.then((dtvalue) => {
            // eslint-disable-next-line no-param-reassign
            me.menuItem.displayText = new mongoose.Types.ObjectId(dtvalue.id);
            if (me.menuItem._id === undefined) {
              mePromise = menuItemService.createMenuItem(me.menuItem);
            } else {
              mePromise = menuItemService.updateMenuItemById(me.menuItem._id, me.menuItem);
            }
          });
        });
      });
      Promise.all([dtPromise, mePromise]).then(() => {
        callback(null, fullMenuSet);
      });
    },
    function (err) {
      if (err) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error While Saving');
      }
    }
  );
};
const getNextMenuCode = async (menuItemCode, _selector) => {
  const query = {
    parentCode: menuItemCode,
    selector: _selector,
  };
  const mi = await menuItemService.queryMenuItems(query, null);
  if (mi.length === 0) {
    return '0';
  }
  return mi[0].code;
};
async function updateData(currentSession, selector, userData, nextMenu, _sessionId) {
  // TODO update currentSession end date if selector is end
  // if (isEndSelector(selector)) {
  // currentSession.endDate = new Date();
  currentSession.sessionId = _sessionId;
  userSessionService.updateUserSessionById(currentSession.id, currentSession);
  userData.lastMenuCode = nextMenu._id;
  userData.data.set(nextMenu._id, selector);
  userDataService.updateUserDataById(userData.id, userData);
}
const getMenu = async (_sessionId, _phoneNumber, _selector) => {
  // get the session : using the sessionId and Phone number
  const currentSession = await userSessionService.getLastSession(_phoneNumber, _sessionId);
  if (!currentSession) {
    // Create New UserSession
    // const ussdUserJson = {
    //   phoneNumber: _phoneNumber,
    //   fullName: '',
    //   defaultLanguage: 'en',
    //   registrationDate: new Date().toString(),
    // };
    const ussdUser = await ussdUserService.getUssdUserByPhoneNumber(_phoneNumber);
    const userDataJ = {
      lastMenuCode: '',
      data: {},
    };
    const userData = await userDataService.createUserData(userDataJ);
    const userSessionJ = {
      startDate: new Date().toString(),
      sessionId: '',
      user: ussdUser.id.toString(),
      userData: userData.id.toString(),
    };
    const userSession = await userSessionService.createUserSession(userSessionJ);
    const allMenuItemsPromise = menuItemService.getMenuItems();
    const allDisplayTextPromise = displayTextService.getDisplayTexts();
    const values = await Promise.all([allMenuItemsPromise, allDisplayTextPromise]);
    allMenuItems = values[0];
    allDisplayText = values[1];
    const nextMenu = new Menu('0');
    allMenuItems.forEach((menuItem) => {
      getParentmenu(menuItem, nextMenu);
    });
    updateData(userSession, _selector, userData, nextMenu, _sessionId);
    return nextMenu;
  }
  const userData = await userDataService.getUserDataById(currentSession.userData.toString());
  // TODO if(userData.lastMenuCode==undefined , show register user
  const nextMenuCode = await getNextMenuCode(userData.lastMenuCode, _selector);
  const nextMenu = await buildMenuAsync(nextMenuCode);
  updateData(currentSession, _selector, userData, nextMenu, _sessionId);
  return nextMenu;
};

function updateEndMenuCode(modelDef, menuItems) {
  let menuItem;
  menuItems.forEach((mi) => {
    if (modelDef.typeName === mi.endModelName) {
      modelDef.endModelCode = mi.code;
      menuItem = mi;
    }
  });
  return menuItem;
}
function getDisplayTextById(displayTexts, displayText) {
  let sdt;
  displayTexts.forEach((dt) => {
    if (dt._id.toString() === displayText.displayText._id.toString()) {
      sdt = dt;
    }
  });
  return sdt;
}
function getParentmenuItem(menuItems, childMI) {
  let smi;
  menuItems.forEach((mi) => {
    if (mi.code === childMI.parentCode) {
      smi = mi;
    }
  });
  return smi;
}
let parentModel;
function getParent() {
  return parentModel;
}
function setParent(_parentModel) {
  parentModel = _parentModel;
}

const getModelDefinitions = async () => {
  const menuItems = await menuItemService.getMenuItems();
  const displayTexts = await displayTextService.getDisplayTexts();

  let startModelItem;
  menuItems.forEach((selectedMI) => {
    if (selectedMI.startModelName !== undefined) {
      startModelItem = selectedMI;
    }
  });
  if (startModelItem === undefined) return;

  const modelDef = {
    typeName: startModelItem.startModelName,
    startMenuCode: startModelItem.code,
    endModelCode: null,
    code_titles: [],
  };
  const endModelMenuItem = updateEndMenuCode(modelDef, menuItems);
  let startNotReached = true;
  const codeTitles = [];
  setParent(endModelMenuItem);

  async.whilst(
    function test(callback) {
      callback(null, startNotReached);
    },
    function iter(callback) {
      const dt = getDisplayTextById(displayTexts, getParent());
      const parentCode = getParent().code.toString();
      const ct = {
        parentCode,
        displayText: dt,
      };
      codeTitles.push(ct);
      // FIND THE PARENT
      if (getParent()) {
        if (startModelItem) {
          if (getParent().code === startModelItem.code) {
            startNotReached = false;
            modelDef.code_titles = codeTitles;
            callback(null, startNotReached);
          } else {
            setParent(getParentmenuItem(menuItems, getParent()));
            callback(null, startNotReached);
          }
        } else {
          setParent(getParentmenuItem(menuItems, getParent()));
          callback(null, startNotReached);
        }
      } else {
        setParent(getParentmenuItem(menuItems, getParent()));
        callback(null, startNotReached);
      }
    },
    function (err) {
      if (err) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error While Saving');
      } else {
        return modelDef;
      }
    }
  );

  return modelDef;
  // codeTitles.forEach((codeDisplayText) => {
  //   modelDef.code_titles.push(codeDisplayText);
  // });
  //   modelDefs.push(modelDef);
};

module.exports = {
  getFullMenuSet,
  saveFullMenuSet,
  getMenu,
  getModelDefinitions,
};
