// const menuItem = require('./menuItem.model');

class menuModel {
  constructor(id, menuItems, displayTexts) {
    this._id = id;

  }

  let menuItems;
  let displayTexts;

  addMenuItem(menuItem, displayTexts) {
    this.menuItems.push(menuItem);
    this.displayTexts.push(displayTexts);
  }

  getText() {
    this._msg = 'dd';
    return this._msg;
  }
}

module.exports = menuModel;
