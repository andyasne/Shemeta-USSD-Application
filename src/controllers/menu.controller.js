/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */

// const httpStatus = require('http-status');
// const {
//   pick
// } = require('lodash');
// const ApiError = require('../utils/ApiError');
// const catchAsync = require('../utils/catchAsync');
// const {
//   menuItemService
// } = require('../services');
// const {
//   menuModel
// } = require('../models/menu.model');
// const {
//   menuItem
// } = require('../models/menuItem.model');

// const getFullMenuTree = catchAsync(async (req, res) => {

//       // get the parent menus by iterating menu item and checking to see if parentMenuItemId is empty, create menu model

//       const menuitems = menuItemService.queryMenuItems();
//       let parentmenuitems = [];

//       menuitems.array.forEach(element => {
//         if (element.parentMenuItems == null) {
//           parent.push(element);
//         }
//       });

//       menuModel parentMenu = new menuModel(0, parentmenuitems);
//       fullMenu: [];
//       fullMenu.push(new [].push(parentmenu));

//       haschildren = true;
//       while (haschildren) {

//         endfullmenuset = fullMenu[fullMenu.length - 1];

//         lastMenuSet = getMenus(endfullmenuset);

//         if (lastMenuSet.length == 0) {
//           haschildren = false;
//         } else {

//           fullMenu.push(lastMenuSet);
//         }

//       }
//       return fullMenu;

//       //iterate the parent menu items , build recursion , a function that received List of menu and return a list of menu,

//       // let _menuModel = new menuModel("dd",)
//       res.status(httpStatus.OK).send(menuModel);
//     }
//     Menus getMenus(_menus)
//     {
//       let result=[];
//       _menus.array.forEach(element => {
//         result.push(getChildMenus(element));

//       });

//       return result;
//     }

//     Menus getChildMenus(menu) {
//       let menus;
//       menu.menuitems.array.forEach(element => {
//         menus.push(getMenu(element.id));
//       });

//     }

//     Menu getMenu(menuItemid) {

//       menuModel _menuModel = new menuModel(menuItemid, []);
//       const menuitems = menuItemService.queryMenuItems();
//       menuitems.array.forEach(element => {
//         if (element.parentMenuItem == menuItemid) {
//           _menuModel.addMenuItem(element);

//         }
//       });
//       return _menuModel;
//     }

//     const SaveMenuTree = catchAsync(async (req, res) => {

//       let fullTree = req.body;

//       fullTree.array.forEach(element => {
//         element.array.forEach(menu => {
//           saveMenu(menu);
//         });
//       });

//       //iterate each array of array of menu, for a single menu iterate menu items , save display text then  update menu item,

//     });

//     function saveMenu(menu) {
//       menu.menuitems.array.forEach(menuItem => {
//         menuItemService.SaveOrUpdate(menuitem);
//       });
//     }
