const mongoose = require('mongoose');

const { Schema } = mongoose;
const smsMessageSchema = new Schema({
  smsTemplate: {
    type: Schema.Types.ObjectId,
    ref: 'smsTemplate',
    required: false

  },
  smsTemplData: {
    type: Schema.Types.ObjectId,
    ref: 'smsTemplData',
    required: false

  },
  ussdUser: {
    type: Schema.Types.ObjectId,
    ref: 'ussdUser',
    required: false

  },
  builtMessage: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  sentTime: {
    type: Date,
  },
  from: {
    type: String,
  },
  sentTo: {
    type: String,
    required: true,
  },
});

const SMSMessage = mongoose.model('smsMessage', smsMessageSchema);

module.exports = SMSMessage;
