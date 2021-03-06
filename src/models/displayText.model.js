const mongoose = require('mongoose');
const { paginate } = require('./plugins');

const { Schema } = mongoose;
const displayTextSchema = new Schema({
  english: {
    type: String,
  },
  amharic: {
    type: String,
  },
  afanOromo: {
    type: String,
  },
  tigrigna: {
    type: String,
  },
  isStatic: {
    type: Boolean,
    default: false,
  },
});

displayTextSchema.plugin(paginate);
const DisplayText = mongoose.model('displayText', displayTextSchema);

module.exports = DisplayText;
