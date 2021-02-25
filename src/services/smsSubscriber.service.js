const httpStatus = require('http-status');
const { SMSSubscriber } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a smsSubscriber
 * @param {Object} smsSubscriberBody
 * @returns {Promise<SMSSubscriber>}
 */
const createSMSSubscriber = async (smsSubscriberBody) => {
  const smsSubscriber = await SMSSubscriber.create(smsSubscriberBody);
  return smsSubscriber;
};

/**
 * Query for smsSubscribers
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const querySMSSubscribers = async (filter) => {
  const smsSubscribers = await SMSSubscriber.find(filter);
  return smsSubscribers;
};
const getSMSSubscribers = async () => {
  const smsSubscribers = await SMSSubscriber.find({});
  return smsSubscribers;
};
/**
 * Get smsSubscriber by id
 * @param {ObjectId} id
 * @returns {Promise<SMSSubscriber>}
 */
const getSMSSubscriberById = async (id) => {
  return SMSSubscriber.findById(id);
};

/**
 * Update smsSubscriber by id
 * @param {ObjectId} smsSubscriberId
 * @param {Object} updateBody
 * @returns {Promise<SMSSubscriber>}
 */
const updateSMSSubscriberById = async (smsSubscriberId, updateBody) => {
  const smsSubscriber = await getSMSSubscriberById(smsSubscriberId);
  if (!smsSubscriber) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SMSSubscriber not found');
  }
  Object.assign(smsSubscriber, updateBody);
  await smsSubscriber.save();
  return smsSubscriber;
};

/**
 * Delete smsSubscriber by id
 * @param {ObjectId} smsSubscriberId
 * @returns {Promise<SMSSubscriber>}
 */
const deleteSMSSubscriberById = async (smsSubscriberId) => {
  const smsSubscriber = await getSMSSubscriberById(smsSubscriberId);
  if (!smsSubscriber) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SMSSubscriber not found');
  }
  await smsSubscriber.remove();
  return smsSubscriber;
};

module.exports = {
  createSMSSubscriber,
  querySMSSubscribers,
  getSMSSubscriberById,
  getSMSSubscribers,
  updateSMSSubscriberById,
  deleteSMSSubscriberById,
};
