const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ussdUserSchema = mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
  },
  defaultLanguage: {
    type: String,
  },
  registrationDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});
ussdUserSchema.plugin(toJSON);
ussdUserSchema.plugin(paginate);

const UssdUser = mongoose.model('UssdUser', ussdUserSchema);

module.exports = UssdUser;
