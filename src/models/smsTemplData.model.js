const mongoose = require('mongoose');

const { Schema } = mongoose;
const smsTemplDataSchema = new Schema({
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
});
const SMSTemplData = mongoose.model('smsTemplData', smsTemplDataSchema);

module.exports = SMSTemplData;
