/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */

const httpStatus = require('http-status');
const { MenuItem, DisplayText, USSDConfig ,Menu} = require('../models');
const menuItemService = require('./menuItem.service');
const displayTextService = require('./displayText.service');

const ApiError = require('../utils/ApiError');

let allMenuItems ;
let allDisplayText;
 const getFullMenuSet = async()=>{

    let fullMenuTree =[];

    let  allMenuItemsPromise= menuItemService.getMenuItems();
     let allDisplayTextPromise = displayTextService.getDisplayTexts();



    await Promise.all([allMenuItemsPromise,allDisplayTextPromise]).then(values=>{
      allMenuItems=values[0];
      allDisplayText=values[1];
      const parentMenu = new Menu("0");

      allMenuItems.forEach(menuItem => {

        getParentmenu(menuItem, parentMenu);

      });

      fullMenuTree.push([parentMenu]);

    })

    return fullMenuTree;
}






function getParentmenu(menuItem, parentMenu) {
  let displayText = {};

  if (menuItem.parentMenuItemId === undefined) {

  allDisplayText.forEach(dt => {
    if (menuItem.displayText !== undefined) {
      if (menuItem.displayText.equals(dt._id)) {
        displayText = dt;
      }
    }
  });
}
;
  parentMenu.addMenuItem(menuItem, displayText);
}

module.exports = {
  getFullMenuSet
}

// const getFullMenuTree = async () => {
// let fullMenuTree=[];
// let haschildren=true;
// var endOfFullMenuTree=[];

//   //Find items where no parent is specified

//   const noParentMenuItems = await MenuItem.find({})

//   if((await noParentMenuItems).length===0){
//    return [];
//   }
// //Add the parent
//   fullMenuTree.push([noParentMenuItems]);

//   while (haschildren) {

//     endOfFullMenuTree = fullMenuTree[fullMenuTree.length - 1];
//     lastMenuSet = getMenus(endOfFullMenuTree);

//     if (lastMenuSet.length == 0) {
//       haschildren = false;
//     } else {
//       fullMenuTree.push(lastMenuSet);
//     }
//   }

// };

// function getMenus(menus)
// {
//   let result=[];
//   menus.array.forEach(menu => {
//     result.push(getChildMenus(menu));

//   });

//   return result;
// }

// function getChildMenus(menu) {
//   let menus;
//   menu.menuitems.array.forEach(element => {
//     menus.push(getMenu(element.id));
//   });

// }

// Menu getMenu(menuItemid) {

//   menuModel _menuModel = new menuModel(menuItemid, []);
//   const menuitems = menuItemService.queryMenuItems();
//   menuitems.array.forEach(element => {
//     if (element.parentMenuItem == menuItemid) {
//       _menuModel.addMenuItem(element);

//     }
//   });
//   return _menuModel;
// }
