const httpStatus = require('http-status');
const { SMSMessage } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a smsMessage
 * @param {Object} smsMessageBody
 * @returns {Promise<SMSMessage>}
 */
const createSMSMessage = async (smsMessageBody) => {
  const smsMessage = await SMSMessage.create(smsMessageBody);
  return smsMessage;
};

/**
 * Query for smsMessages
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const querySMSMessages = async (filter) => {
  const smsMessages = await SMSMessage.find(filter);
  return smsMessages;
};
const getSMSMessages = async () => {
  const smsMessages = await SMSMessage.find({});
  return smsMessages;
};
/**
 * Get smsMessage by id
 * @param {ObjectId} id
 * @returns {Promise<SMSMessage>}
 */
const getSMSMessageById = async (id) => {
  return SMSMessage.findById(id);
};

/**
 * Update smsMessage by id
 * @param {ObjectId} smsMessageId
 * @param {Object} updateBody
 * @returns {Promise<SMSMessage>}
 */
const updateSMSMessageById = async (smsMessageId, updateBody) => {
  const smsMessage = await getSMSMessageById(smsMessageId);
  if (!smsMessage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SMSMessage not found');
  }
  Object.assign(smsMessage, updateBody);
  await smsMessage.save();
  return smsMessage;
};

/**
 * Delete smsMessage by id
 * @param {ObjectId} smsMessageId
 * @returns {Promise<SMSMessage>}
 */
const deleteSMSMessageById = async (smsMessageId) => {
  const smsMessage = await getSMSMessageById(smsMessageId);
  if (!smsMessage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SMSMessage not found');
  }
  await smsMessage.remove();
  return smsMessage;
};

module.exports = {
  createSMSMessage,
  querySMSMessages,
  getSMSMessageById,
  getSMSMessages,
  updateSMSMessageById,
  deleteSMSMessageById,
};
