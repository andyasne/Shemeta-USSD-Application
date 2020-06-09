/* eslint-disable prefer-destructuring */
const { Menu } = require('../models');
const menuItemService = require('./menuItem.service');
const displayTextService = require('./displayText.service');

let allMenuItems;
let allDisplayText;
function buildMenu(menuItemId) {
  const _menu = new Menu(menuItemId);
  allMenuItems.forEach((menuItem) => {
    let displayText = {};
    if (menuItem.parentMenuItemId !== undefined) {
      if (menuItem.parentMenuItemId.equals(menuItemId)) {
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
      const newMenu = buildMenu(menuElement.menuItem.id);
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
  if (menuItem.parentMenuItemId === null) {
    allDisplayText.forEach((dt) => {
      if (menuItem.displayText !== undefined) {
        if (menuItem.displayText.equals(dt._id)) {
          displayText = dt;
        }
      }
    });
  }
  parentMenu.addMenuElements(menuItem, displayText);
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
    function test(cb) {
      cb(null, fullMenuSet.length > 0);
    },
    function iter(callback) {
      const menuElement = fullMenuSet.pop();

      menuElement.forEach((me) => {
        if (me.displayTexts.id === null) {
          // save
          dtPromise = displayTextService.createDisplayText(me.displayText);
        } else {
          dtPromise = displayTextService.updateDisplayTextById(me.displayText.id, me.displayText);
        }

        dtPromise.then((dtvalue) => {
          me.displayText = new Object(dtvalue.id);
          if (me.id === null) {
            mePromise=   menuItemService.createMenuItem(me);
          }else{

            mePromise=   menuItemService.updateMenuItemById(me.id,me);
          }


        });

      });

    },
    function (err, n) {
      if (n) {
        return getFullMenuSet();
      }
    }
  );
};

module.exports = {
  getFullMenuSet,
  saveFullMenuSet
};
