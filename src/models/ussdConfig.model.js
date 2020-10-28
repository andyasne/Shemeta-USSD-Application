const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;
const ussdConfigSchema = new Schema({
  Languages: [],
  defaultLanguage: {
    type: String,

    default: 'amharic',
  },
  nextMenuCode: {
    type: String,
    default: '0',
  },
  validationDisplayTextLength: {
    type: Number,

    default: 30,
  },
});
ussdConfigSchema.plugin(toJSON);
ussdConfigSchema.plugin(paginate);

const USSDConfig = mongoose.model('ussdConfig', ussdConfigSchema);
module.exports = USSDConfig;
