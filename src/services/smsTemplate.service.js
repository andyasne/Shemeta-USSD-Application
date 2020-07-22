const httpStatus = require('http-status');
const { SMSTemplate } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a smsTemplate
 * @param {Object} smsTemplateBody
 * @returns {Promise<SMSTemplate>}
 */
const createSMSTemplate = async (smsTemplateBody) => {
  const smsTemplate = await SMSTemplate.create(smsTemplateBody);
  return smsTemplate;
};

/**
 * Query for smsTemplates
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const querySMSTemplates = async (filter) => {
  const smsTemplates = await SMSTemplate.find(filter);
  return smsTemplates;
};
const getSMSTemplates = async () => {
  const smsTemplates = await SMSTemplate.find({});
  return smsTemplates;
};
/**
 * Get smsTemplate by id
 * @param {ObjectId} id
 * @returns {Promise<SMSTemplate>}
 */
const getSMSTemplateById = async (id) => {
  return SMSTemplate.findById(id);
};

/**
 * Update smsTemplate by id
 * @param {ObjectId} smsTemplateId
 * @param {Object} updateBody
 * @returns {Promise<SMSTemplate>}
 */
const updateSMSTemplateById = async (smsTemplateId, updateBody) => {
  const smsTemplate = await getSMSTemplateById(smsTemplateId);
  if (!smsTemplate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SMSTemplate not found');
  }
  Object.assign(smsTemplate, updateBody);
  await smsTemplate.save();
  return smsTemplate;
};

/**
 * Delete smsTemplate by id
 * @param {ObjectId} smsTemplateId
 * @returns {Promise<SMSTemplate>}
 */
const deleteSMSTemplateById = async (smsTemplateId) => {
  const smsTemplate = await getSMSTemplateById(smsTemplateId);
  if (!smsTemplate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SMSTemplate not found');
  }
  await smsTemplate.remove();
  return smsTemplate;
};

module.exports = {
  createSMSTemplate,
  querySMSTemplates,
  getSMSTemplateById,
  getSMSTemplates,
  updateSMSTemplateById,
  deleteSMSTemplateById,
};
