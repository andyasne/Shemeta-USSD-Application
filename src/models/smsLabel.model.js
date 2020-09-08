const mongoose = require('mongoose');

const { Schema } = mongoose;
const smsLabelSchema = new Schema({
  am: {
    type: String,
  },
  en: {
    type: String,
    default: this.am,
  },
  oro: {
    type: String,
    default: this.am,
  },
  tig: {
    type: String,
    default: this.am,
  },
});

const SMSLabel = mongoose.model('smsLabel', smsLabelSchema);

module.exports = SMSLabel;
