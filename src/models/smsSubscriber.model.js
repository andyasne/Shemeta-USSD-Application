const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const { Schema } = mongoose;
const smsSubscriberSchema = mongoose.Schema({
  phoneNumber: {
    type: String,
  },
  subscribedDate: {
    type: Date,
  },
  unSubscribedDate: {
    type: Date,
  },
  status: {
    type: String,
  },
  lastSentVASMessage: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'VASMessage',
  },
});
smsSubscriberSchema.plugin(toJSON);

const SMSSubscriber = mongoose.model('SMSSubscriber', smsSubscriberSchema);

module.exports = SMSSubscriber;
