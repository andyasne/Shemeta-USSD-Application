const httpStatus = require('http-status');
const { pick } = require('lodash');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { smsSubscriberService } = require('../services');

const createSMSSubscriber = catchAsync(async (req, res) => {
  const smsSubscriber = await smsSubscriberService.createSMSSubscriber(req.body);
  res.status(httpStatus.CREATED).send(smsSubscriber);
});

const subscribeSMSSubscribers = catchAsync(async (req, res) => {
  const smsSubscribers = await smsSubscriberService.subscribeSMSSubscribers(req.body);
  res.status(httpStatus.CREATED).send(smsSubscribers);
});
const sendWelcomeMessage = catchAsync(async (req, res) => {
  const welcomeMessageSubscribers = await smsSubscriberService.sendWelcomeMessage(req.body);
  res.status(httpStatus.CREATED).send(welcomeMessageSubscribers);
});

const sendNextVasMessagestoSMSSubscribers = catchAsync(async (req, res) => {
  await smsSubscriberService.sendNextVasMessagestoSMSSubscribers();
  res.status(httpStatus.NO_CONTENT).send();
});

const getSMSSubscribers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['defaultLanguage']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await smsSubscriberService.querySMSSubscribers(filter, options);
  res.send(result);
});

const getSMSSubscriber = catchAsync(async (req, res) => {
  const smsSubscriber = await smsSubscriberService.getSMSSubscriberById(req.params.smsSubscriberId);
  if (!smsSubscriber) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SMSSubscriber not found');
  }
  res.send(smsSubscriber);
});

const updateSMSSubscriber = catchAsync(async (req, res) => {
  const smsSubscriber = await smsSubscriberService.updateSMSSubscriberById(req.params.smsSubscriberId, req.body);
  res.send(smsSubscriber);
});

const deleteSMSSubscriber = catchAsync(async (req, res) => {
  await smsSubscriberService.deleteSMSSubscriberById(req.params.smsSubscriberId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSMSSubscriber,
  getSMSSubscribers,
  getSMSSubscriber,
  updateSMSSubscriber,
  deleteSMSSubscriber,
  sendNextVasMessagestoSMSSubscribers,
  subscribeSMSSubscribers,
  sendWelcomeMessage,
};
