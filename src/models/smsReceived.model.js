const mongoose = require('mongoose');

const { Schema } = mongoose;
const smsReceivedSchema = new Schema({
   
  senderPhoneNumber: {
    type: String 
  },
 
  sentMessage: {
    type: String,
  },
  receiverPhoneNumber: {
    type: String,
  },
  sentTime: {
    type: String,
  },
  
  receivedDate: {
    type: Date,
    default: new Date()
  },
});

const smsReceived = mongoose.model('smsReceived', smsReceivedSchema);

module.exports = smsReceived;
