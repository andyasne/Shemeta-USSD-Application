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

let allMenuItems;
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
  if (menuItem.parentCode === undefined || menuItem.parentCode === null || menuItem.parentCode === '') {
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
  return mi[0].code;
};
function isEndSelector() {
  // TODO
  return false;
}
async function updateData(currentSession, selector, userData, nextMenu) {
  // TODO update currentSession end date if selector is end
  if (isEndSelector(selector)) {
    currentSession.endDate = new Date();
    userSessionService.updateUserSessionById(currentSession.id, currentSession);
  }
  userData.lastMenuCode = nextMenu._id;
  userData.data.set(nextMenu._id, selector);
  userDataService.updateUserDataById(userData.id, userData);
}
const getMenu = async (sessionId, phoneNumber, selector) => {
  // get the session : using the sessionId and Phone number
  const currentSession = await userSessionService.getLastSession(phoneNumber, sessionId);
  const userData = await userDataService.getUserDataById(currentSession.userData.toString());
  // TODO if(userData.lastMenuCode==undefined , show register user
  const nextMenuCode = await getNextMenuCode(userData.lastMenuCode, selector);
  const nextMenu = await buildMenuAsync(nextMenuCode);
  updateData(currentSession, selector, userData, nextMenu);
  return nextMenu;
};
module.exports = {
  getFullMenuSet,
  saveFullMenuSet,
  getMenu,
};
