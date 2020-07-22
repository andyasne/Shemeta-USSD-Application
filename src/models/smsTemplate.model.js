const mongoose = require('mongoose');

const { Schema } = mongoose;
const smsTemplateSchema = new Schema({
  smsLabel: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'smsLabel',
  },
  additionalAttributes: {
    type: String,
  },
});

const SMSTemplate = mongoose.model('smsTemplate', smsTemplateSchema);

module.exports = SMSTemplate;
