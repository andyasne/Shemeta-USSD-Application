/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
const mongoose = require('mongoose');

const httpStatus = require('http-status');
const { SMSSubscriber } = require('../models');

const ApiError = require('../utils/ApiError');
const vasMessageService = require('./vasMessage.service');
const smsService = require('./sms.service');
const smsTemplateService = require('./smsTemplData.service');
const smsLabelService = require('./smsLabel.service');

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
async function sendVasMessage(smsSubscriber, nextVasMessage) {
  const smsTemplate = smsTemplateService.getSMSTemplDataById(nextVasMessage.smsTemplate);
  const smsLabel = smsLabelService.getSMSLabelById(smsTemplate.smsLabel);
  smsService.sendMessage(smsLabel.am, smsSubscriber.phoneNumber);
}
const sendNextVasMessagestoSMSSubscribers = async () => {
  const smsSubscribers = await getSMSSubscribers();
  smsSubscribers.forEach(async (smsSubscriber) => {
    if (smsSubscriber.isActive) {
      let nextVasMessage;
      if (smsSubscriber.lastSentVASMessage === undefined) {
        nextVasMessage = await vasMessageService.getNextVASMessage(0); // SELECT THE FIRST MESSAGE
      } else {
        nextVasMessage = await vasMessageService.getVASMessageById(smsSubscriber.lastSentVASMessage);
        nextVasMessage = await vasMessageService.getNextVASMessage(Number(nextVasMessage.order));
      }

      if (nextVasMessage !== undefined) {
        // send messages here
        await sendVasMessage(smsSubscriber, nextVasMessage);
        // update smsSubscriberNextMessage
        // eslint-disable-next-line no-param-reassign
        smsSubscriber.lastSentVASMessage = new mongoose.Types.ObjectId(nextVasMessage.id);
        await updateSMSSubscriberById(smsSubscriber._id, smsSubscriber);
      }
    }
  });
};

const subscribeSMSSubscribers = async (smsSubscribers) => {
  const promises = [];
  for (let i = 0; i < smsSubscribers.length; i++) {
    smsSubscribers[i].subscribedDate = new Date();
    promises.push(updateSMSSubscriberById(smsSubscribers[i].id, smsSubscribers[i]));
  }
  const results = await Promise.all(promises);
  return results;
};

const sendWelcomeMessage = async (smsSubscribers) => {
  const wellcomeVasMessage = await vasMessageService.getNextVASMessage(0); // SELECT THE FIRST MESSAGE

  const promises = [];
  for (let i = 0; i < smsSubscribers.length; i++) {
    sendVasMessage(smsSubscribers[i], wellcomeVasMessage);
    smsSubscribers[i].lastSentVASMessage = new mongoose.Types.ObjectId(wellcomeVasMessage.id);
    promises.push(updateSMSSubscriberById(smsSubscribers[i].id, smsSubscribers[i]));
  }
  const results = await Promise.all(promises);
  return results;
};

module.exports = {
  createSMSSubscriber,
  querySMSSubscribers,
  getSMSSubscriberById,
  getSMSSubscribers,
  updateSMSSubscriberById,
  deleteSMSSubscriberById,
  sendNextVasMessagestoSMSSubscribers,
  subscribeSMSSubscribers,
  sendWelcomeMessage,
};
