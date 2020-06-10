/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */

const async = require('async');
const mongoose = require('mongoose');
const { Menu } = require('../models');
const menuItemService = require('./menuItem.service');
const displayTextService = require('./displayText.service');

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
function getChildMenusFromMI(parent, menuSet) {
  if (parent.menuElements) {
    parent.menuElements.forEach((menuElement) => {
      const newMenu = buildMenu(menuElement.menuItem.code);
      if (newMenu.menuElements.length !== 0) {
        menuSet.push(newMenu);
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
            me.menuItem.displayText = new mongoose.Types.ObjectId(dtvalue.id);
            if (me.menuItem._id === undefined) {
              mePromise = menuItemService.createMenuItem(me.menuItem);
            } else {
              mePromise = menuItemService.updateMenuItemById(me.menuItem._id, me.menuItem);
            }
          });
        });
      });

     Promise.all([dtPromise, mePromise]).then((values) => {
        callback(null, fullMenuSet);
      });
    },
    function (err, n) {
      if (n) {
              return dtPromise;
        }
    }
  );


};

module.exports = {
  getFullMenuSet,
  saveFullMenuSet,
};
