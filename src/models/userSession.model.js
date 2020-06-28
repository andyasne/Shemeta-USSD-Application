const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;
const userSessionSchema = mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  sessionId: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'ussdUser',
  },
  userData: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'userData',
  },
});
userSessionSchema.plugin(toJSON);
userSessionSchema.plugin(paginate);

const UserSession = mongoose.model('UserSession', userSessionSchema);

module.exports = UserSession;
