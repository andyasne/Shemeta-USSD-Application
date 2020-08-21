const mongoose = require('mongoose');

const { Schema } = mongoose;
const smsLabelSchema = new Schema({
  am: {
    type: String,
  },
  en: {
    type: String,
  },
  oro: {
    type: String,
  },
  tig: {
    type: String,
  },

});

const SMSLabel = mongoose.model('smsLabel', smsLabelSchema);

module.exports = SMSLabel;
