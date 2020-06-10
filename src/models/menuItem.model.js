const mongoose = require('mongoose');

const { Schema } = mongoose;
const { paginate } = require('./plugins');

const menuItemSchema = new Schema({
  displayText: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'displayText',
  },
  code: {
    type: String,
  },
  parentCode: {
    type: String,
  },
  selector: {
    type: String,
  },
  order: {
    type: Number,
  },
  menuType: {
    type: String,
    required: false,
  },
  questionDataType: {
    type: String,
    required: false,
  },
  loadUserData: {
    type: Boolean,
    default: false,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  additionalAttributes: {
    type: String,
  },

  exit: {
    type: Boolean,
    required: false,
    default: false,
  },
  redirect: {
    type: String,
  },
  api: {
    type: String,
  },
});
menuItemSchema.plugin(paginate);
const MenuItem = mongoose.model('menuItem', menuItemSchema);

module.exports = MenuItem;
