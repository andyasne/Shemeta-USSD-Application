const httpStatus = require('http-status');
const { SMSTemplData } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a smsTemplData
 * @param {Object} smsTemplDataBody
 * @returns {Promise<SMSTemplData>}
 */
const createSMSTemplData = async (smsTemplDataBody) => {
  const smsTemplData = await SMSTemplData.create(smsTemplDataBody);
  return smsTemplData;
};

/**
 * Query for smsTemplDatas
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const querySMSTemplDatas = async (filter) => {
  const smsTemplDatas = await SMSTemplData.find(filter);
  return smsTemplDatas;
};
const getSMSTemplDatas = async () => {
  const smsTemplDatas = await SMSTemplData.find({});
  return smsTemplDatas;
};
/**
 * Get smsTemplData by id
 * @param {ObjectId} id
 * @returns {Promise<SMSTemplData>}
 */
const getSMSTemplDataById = async (id) => {
  return SMSTemplData.findById(id);
};

/**
 * Update smsTemplData by id
 * @param {ObjectId} smsTemplDataId
 * @param {Object} updateBody
 * @returns {Promise<SMSTemplData>}
 */
const updateSMSTemplDataById = async (smsTemplDataId, updateBody) => {
  const smsTemplData = await getSMSTemplDataById(smsTemplDataId);
  if (!smsTemplData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SMSTemplData not found');
  }
  Object.assign(smsTemplData, updateBody);
  await smsTemplData.save();
  return smsTemplData;
};

/**
 * Delete smsTemplData by id
 * @param {ObjectId} smsTemplDataId
 * @returns {Promise<SMSTemplData>}
 */
const deleteSMSTemplDataById = async (smsTemplDataId) => {
  const smsTemplData = await getSMSTemplDataById(smsTemplDataId);
  if (!smsTemplData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SMSTemplData not found');
  }
  await smsTemplData.remove();
  return smsTemplData;
};

module.exports = {
  createSMSTemplData,
  querySMSTemplDatas,
  getSMSTemplDataById,
  getSMSTemplDatas,
  updateSMSTemplDataById,
  deleteSMSTemplDataById,
};
