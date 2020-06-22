const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSessionSchema = mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  userData: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'userData',
  },
});

const UserSession = mongoose.model('UserSession', userSessionSchema);

module.exports = UserSession;
