const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const { Schema } = mongoose;
const smsSubscriberSchema = mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  subscribedDate: {
    type: Date,
  },
  unSubscribedDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  lastSentVASMessage: {
    type: Schema.Types.ObjectId,
    ref: 'vasMessage',
  },
});
smsSubscriberSchema.plugin(toJSON);

const SMSSubscriber = mongoose.model('SMSSubscriber', smsSubscriberSchema);

module.exports = SMSSubscriber;
