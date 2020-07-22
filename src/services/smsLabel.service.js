const httpStatus = require('http-status');
const { SMSLabel } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a smsLabel
 * @param {Object} smsLabelBody
 * @returns {Promise<SMSLabel>}
 */
const createSMSLabel = async (smsLabelBody) => {
  const smsLabel = await SMSLabel.create(smsLabelBody);
  return smsLabel;
};

/**
 * Query for smsLabels
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const querySMSLabels = async (filter) => {
  const smsLabels = await SMSLabel.find(filter);
  return smsLabels;
};
const getSMSLabels = async () => {
  const smsLabels = await SMSLabel.find({});
  return smsLabels;
};
/**
 * Get smsLabel by id
 * @param {ObjectId} id
 * @returns {Promise<SMSLabel>}
 */
const getSMSLabelById = async (id) => {
  return SMSLabel.findById(id);
};

/**
 * Update smsLabel by id
 * @param {ObjectId} smsLabelId
 * @param {Object} updateBody
 * @returns {Promise<SMSLabel>}
 */
const updateSMSLabelById = async (smsLabelId, updateBody) => {
  const smsLabel = await getSMSLabelById(smsLabelId);
  if (!smsLabel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SMSLabel not found');
  }
  Object.assign(smsLabel, updateBody);
  await smsLabel.save();
  return smsLabel;
};

/**
 * Delete smsLabel by id
 * @param {ObjectId} smsLabelId
 * @returns {Promise<SMSLabel>}
 */
const deleteSMSLabelById = async (smsLabelId) => {
  const smsLabel = await getSMSLabelById(smsLabelId);
  if (!smsLabel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SMSLabel not found');
  }
  await smsLabel.remove();
  return smsLabel;
};

module.exports = {
  createSMSLabel,
  querySMSLabels,
  getSMSLabelById,
  getSMSLabels,
  updateSMSLabelById,
  deleteSMSLabelById,
};
