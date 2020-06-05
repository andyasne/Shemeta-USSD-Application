// const menuItem = require('./menuItem.model');

class menuModel {
  constructor(id, menuItems, displayTexts) {
    this._id = id;
    this._menuItems = menuItems;
    this._displayTexts = displayTexts;
  }

  addMenuItem(menuItem, displayTexts) {
    this._menuItems.push(menuItem);
    this._displayTexts.push(displayTexts);
  }

  getText() {
    this._msg = 'dd';
    return this._msg;
  }
}

module.exports = menuModel;
