const mongoose = require('mongoose');

const { Schema } = mongoose;
const { paginate } = require('./plugins');

const menuItemSchema = new Schema({
  displayText: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'displayText',
  },
  selector: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  menuType: {
    type: String,
    required: true,
  },
  questionDataType: {
    type: String,
    required: true,
  },
  loadUserData: {
    type: Boolean,
    required: true,
  },
  readOnly: {
    type: Boolean,
    required: true,
  },
  additionalAttributes: {
    type: String,
  },
  parentMenuItemId: {
    type: Schema.Types.ObjectId,
    ref: 'menuItem',
  },
  exit: {
    type: Boolean,
    required: true,
    default: false,
  },
  redirect: {
    type: Schema.Types.ObjectId,
    ref: 'menuItem',
  },
  api: {
    type: String,
  },
});
menuItemSchema.plugin(paginate);
const MenuItem = mongoose.model('menuItem', menuItemSchema);

module.exports = MenuItem;
