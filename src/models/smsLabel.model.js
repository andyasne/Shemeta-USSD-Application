const mongoose = require('mongoose');

const { Schema } = mongoose;
const smsLabelSchema = new Schema({
  am: {
    type: String,
    required: true,
  },
  en: {
    type: String,
    required: true,
  },
  oro: {
    type: String,
    required: true,
  },
  tig: {
    type: String,
    required: true,
  },
});

const SMSLabel = mongoose.model('smsLabel', smsLabelSchema);

module.exports = SMSLabel;
