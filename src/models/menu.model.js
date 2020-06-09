// const menuItem = require('./menuItem.model');

class menuModel {
  constructor(id ) {
    this._id = id;
    this.menuElements=[];
  }

  addMenuElements(menuItem, displayTexts) {
    this.menuElements.push({menuItem,displayTexts});
  }

  getText() {
    this._msg = 'dd';
    return this._msg;
  }
}

module.exports = menuModel;
