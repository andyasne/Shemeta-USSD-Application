const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;
const userDataSchema = new Schema({
  data: {
    type: Map,
    required: false,
  },
  lastMenuCode: {
    type: String,
  },
});
userDataSchema.plugin(toJSON);
userDataSchema.plugin(paginate);

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = UserData;
