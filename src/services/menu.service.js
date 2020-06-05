/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */

// const httpStatus = require('http-status');
// const { MenuItem, DisplayText, USSDConfig } = require('../models');
// const menuItemService = require('./menuItem.service');

// const ApiError = require('../utils/ApiError');

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
