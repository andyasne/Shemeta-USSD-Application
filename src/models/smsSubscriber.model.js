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
    default: false,
  },

  lastSentVASMessage: {
    type: Schema.Types.ObjectId,
    ref: 'VASMessage',
  }, 
  lastSentVASMessageResult: {
    type: String
  }}
 
);

smsSubscriberSchema.virtual('phoneNumberTrim').get(function () {
  let result = this.phoneNumber;
  if (this.phoneNumber.length >= 9) {
     result = this.phoneNumber.substring(this.phoneNumber.length - 9, this.phoneNumber.length);
   }
  return result
});
smsSubscriberSchema.plugin(toJSON);

const SMSSubscriber = mongoose.model('SMSSubscriber', smsSubscriberSchema);

module.exports = SMSSubscriber;
