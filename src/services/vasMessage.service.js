/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const httpStatus = require('http-status');
const loadash = require('lodash');
const { VASMessage } = require('../models');
const smsService = require('./sms.service');
const ApiError = require('../utils/ApiError');

/**
 * Create a vasMessage
 * @param {Object} vasMessageBody
 * @returns {Promise<VASMessage>}
 */
const createVASMessage = async (vasMessageBody) => {
  const vasMessage = await VASMessage.create(vasMessageBody);
  return vasMessage;
};

const uploadVASMessages = async (vasMessages) => {
  vasMessages.forEach(async (vasMessage) => {
    const _smsTemplate = vasMessage.smsTemplate;
    delete vasMessage.smsTemplate;
    const smsTemplate = await smsService.saveSMSTemplate(_smsTemplate);
    vasMessage.smsTemplate = new mongoose.Types.ObjectId(smsTemplate.template._id);
    await VASMessage.create(vasMessage);
  });
};

/**
 * Query for vasMessages
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const queryVASMessages = async (filter) => {
  const vasMessages = await VASMessage.find(filter);
  return vasMessages;
};
const getVASMessages = async () => {
  const vasMessages = await VASMessage.find({});
  return vasMessages;
};
/**
 * Get vasMessage by id
 * @param {ObjectId} id
 * @returns {Promise<VASMessage>}
 */
const getVASMessageById = async (id) => {
  return VASMessage.findById(id);
};

/**
 * Update vasMessage by id
 * @param {ObjectId} vasMessageId
 * @param {Object} updateBody
 * @returns {Promise<VASMessage>}
 */
const updateVASMessageById = async (vasMessageId, updateBody) => {
  const vasMessage = await getVASMessageById(vasMessageId);
  if (!vasMessage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'VASMessage not found');
  }
  Object.assign(vasMessage, updateBody);
  await vasMessage.save();
  return vasMessage;
};

/**
 * Delete vasMessage by id
 * @param {ObjectId} vasMessageId
 * @returns {Promise<VASMessage>}
 */
const deleteVASMessageById = async (vasMessageId) => {
  const vasMessage = await getVASMessageById(vasMessageId);
  if (!vasMessage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'VASMessage not found');
  }
  await vasMessage.remove();
  return vasMessage;
};

const getNextVASMessage = async (currentVasMessageOrder) => {
  const vasMessages = await getVASMessages();
  loadash.sortBy(vasMessages, ['order']);
  let currentReached = false;
  let nextVasMessage;
  vasMessages.forEach((vasMessage) => {
    if (currentReached) {
      if (vasMessage.isActive && nextVasMessage === undefined) {
        nextVasMessage = vasMessage;
      }
    }

    if (vasMessage.order === Number(currentVasMessageOrder)) {
      currentReached = true;
    }
  });

  return nextVasMessage;
};

module.exports = {
  createVASMessage,
  queryVASMessages,
  getVASMessageById,
  getVASMessages,
  updateVASMessageById,
  deleteVASMessageById,
  getNextVASMessage,
  uploadVASMessages,
};
