const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const { Schema } = mongoose;
const vasMessageSchema = mongoose.Schema({
  category: {
    type: String,
  },
  order: {
    type: Number,
    // auroincreament
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  smsTemplate: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'smsTemplate',
  },
});
vasMessageSchema.plugin(toJSON);

const VASMessage = mongoose.model('VASMessage', vasMessageSchema);

module.exports = VASMessage;
