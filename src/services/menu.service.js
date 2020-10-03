/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const async = require('async');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const loadash = require('lodash');
const Menu = require('../models/menu.model');
const menuItemService = require('./menuItem.service');
const displayTextService = require('./displayText.service');
const ApiError = require('../utils/ApiError');
const userDataService = require('./userData.service');
const userSessionService = require('./userSession.service');
const ussdUserService = require('./ussdUser.service');

let parentModel;
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
async function removeLastData(userData) {
  if (loadash.size(userData.data) >= 2) {
    const dataCount = loadash.size(userData.data);
    let index = 0;
    let lastMenuKey;
    const newData = new Map();
    userData.data.forEach((value, key) => {
      if (index !== dataCount - 1) {
        newData.set(key, value);
        lastMenuKey = key;
      }
      index += 1;
    });
    userData.data = null;
    await userDataService.updateUserDataById(userData.id, userData);
    userData.data = newData;
    userData.lastMenuCode = lastMenuKey;
    await userDataService.updateUserDataById(userData.id, userData);
  }
}

function sortMenuItems(menu) {
  menu.menuElements.sort((a, b) => (a.menuItem.order > b.menuItem.order ? 1 : -1));
}

const getMenu = async (_sessionId, _phoneNumber, _selector) => {
  // get the session : using the sessionId and Phone number
  let currentSession = await userSessionService.getLastSession(_phoneNumber, _sessionId);
  const ussdUser = await ussdUserService.getUssdUserByPhoneNumber(_phoneNumber);
  let nextMenu;
  let nextMenuCode = '';
  let lastmenuCode = '';
  let userData;

  if (!currentSession) {
    currentSession = await userSessionService.createNewSessionInstance('', ussdUser);
    userData = await userDataService.getUserDataById(currentSession.userData.toString());
    const allMenuItemsPromise = menuItemService.getMenuItems();
    const allDisplayTextPromise = displayTextService.getDisplayTexts();
    const values = await Promise.all([allMenuItemsPromise, allDisplayTextPromise]);
    allMenuItems = values[0];
    allDisplayText = values[1];
    nextMenu = new Menu('0');
    allMenuItems.forEach((menuItem) => {
      getParentmenu(menuItem, nextMenu);
    });
  } else {
    userData = await userDataService.getUserDataById(currentSession.userData.toString());
    if (_selector === '0' && loadash.size(userData.data) >= 2) {
      const dataCount = loadash.size(userData.data);
      let index = 0;
      let selectorForLastMenu;
      userData.data.forEach((dt) => {
        if (index === dataCount - 3) {
          lastmenuCode = dt;
        }
        if (index === dataCount - 2) {
          selectorForLastMenu = dt;
        }
        index += 1;
      });
      nextMenuCode = await getNextMenuCode(lastmenuCode, selectorForLastMenu);
    } else {
      lastmenuCode = userData.lastMenuCode;
      nextMenuCode = await getNextMenuCode(lastmenuCode, _selector);
    }
    nextMenu = await buildMenuAsync(nextMenuCode);
  }
  sortMenuItems(nextMenu);
  if (_selector === '0' && loadash.size(userData.data) >= 2) {
    removeLastData(userData);
  } else {
    updateData(currentSession, _selector, userData, nextMenu, _sessionId);
  }
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

function getParent() {
  return parentModel;
}

function setParent(_parentModel) {
  parentModel = _parentModel;
}

const getModelDefinitions = async () => {
  const menuItems = await menuItemService.getMenuItems();
  const displayTexts = await displayTextService.getDisplayTexts();
  const modelDefs = [];
  let startModelItem;
  menuItems.forEach((selectedMI) => {
    if (selectedMI.startModelName !== undefined) {
      startModelItem = selectedMI;

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
                modelDef.code_titles = codeTitles.reverse();
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
            modelDefs.push(modelDef);
          }
        }
      );
    }
  });

  return modelDefs;
};

function getModelTypeName(modelDef, data) {
  let result;
  modelDef.code_titles.forEach((modelD) => {
    if (modelD.parentCode === data) {
      result = modelD.displayText.amharic; // TODO: fetch the default lang for the user
    }
  });
  return result;
}

function getUserDataById(userDatas, id) {
  let result;
  userDatas.forEach((userData) => {
    if (userData._id.toString() === id) {
      result = userData;
    }
  });
  return result;
}

function getUssdUserById(ussdUser, id) {
  let result;
  ussdUser.forEach((ussdU) => {
    if (ussdU._id.toString() === id) {
      result = ussdU;
    }
  });
  return result;
}

const getUserData = async () => {
  const userDatas = await userDataService.getUserDatas();
  const userSessions = await userSessionService.getUserSessions();
  const modelDefs = await getModelDefinitions();
  const ussdUser = await ussdUserService.getUssdUsers();
  const respUserDatas = [];

  let selectModelforPopulation = false;
  let respUserData;

  modelDefs.forEach((modelDef) => {
    userSessions.forEach((userSession) => {
      const user = getUssdUserById(ussdUser, userSession.user.toString());
      const userData = getUserDataById(userDatas, userSession.userData.toString());
      selectModelforPopulation = false;
      const keyIterator = userData.data.keys();
      let done = false;
      while (!done) {
        const val = keyIterator.next();
        done = val.done;
        const data = userData.data.get(val.value);
        if (val.value === modelDef.startMenuCode) {
          // select the user data
          selectModelforPopulation = true;
          respUserData = {
            type: '',
            user,
            data: [],
          };
          respUserData.type = modelDef.typeName;
          // respUserData.user=
        }

        if (selectModelforPopulation) {
          const dt = {
            name: getModelTypeName(modelDef, val.value),
            value: data,
          };
          respUserData.data.push(dt);
        }
        if (val.value === modelDef.endModelCode) {
          done = true;
        }
      }

      if (selectModelforPopulation) {
        respUserDatas.push(respUserData);
      }
    });
  });

  return respUserDatas;
};

module.exports = {
  getFullMenuSet,
  saveFullMenuSet,
  getMenu,
  getModelDefinitions,
  getUserData,
};
