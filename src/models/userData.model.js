const mongoose = require('mongoose');

const { Schema } = mongoose;
const userDataSchema = new Schema({
  data: {
    type: Map,
    required: true,
  },
  lastMenuItemId: {
    type: String,
    required: true,
  },
});



const UserData = mongoose.model('UserData', userDataSchema);

module.exports = UserData;
