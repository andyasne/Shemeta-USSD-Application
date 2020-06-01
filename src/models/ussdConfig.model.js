const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;
const ussdConfigSchema = new Schema({
  Languages: [],
  defaultLanguage: {
    type: String,
    required: true,
    default: 'amharic',
  },
  validationDisplayTextLength: {
    type: Number,
    required: true,
    default: 30,
  },
});
ussdConfigSchema.plugin(toJSON);
ussdConfigSchema.plugin(paginate);

const USSDConfig = mongoose.model('ussdConfig', ussdConfigSchema);
module.exports = USSDConfig;
