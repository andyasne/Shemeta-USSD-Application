const httpStatus = require('http-status');
const { replace } = require('lodash');
const { pick } = require('lodash');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { smsSubscriberService } = require('../services');


const smsReceived = require('../models/smsReceived.model')

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
  const result = await smsSubscriberService.sendNextVasMessagestoSMSSubscribers();
  res.status(httpStatus.CREATED).send(result);

});

const getSMSSubscribers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['defaultLanguage']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await smsSubscriberService.querySMSSubscribers(filter, options);
  res.status(httpStatus.CREATED).send(result);
});


const sendNextVasMessagestoSMSSubscribersByPhoneNumber = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['phoneNumber']);
  const result = await smsSubscriberService.sendNextVasMessagestoSMSSubscriberByPhoneNumber(filter);
  res.status(httpStatus.CREATED).send(result);

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
const receivedMessage = catchAsync(async (req, res) => {
  let _smsReceived = new smsReceived();
  _smsReceived.senderPhoneNumber = pick(req.query, ['p']).p;
  _smsReceived.sentTime = pick(req.query, ['t']).t;
  _smsReceived.sentMessage = pick(req.query, ['a']).a;
  if ( _smsReceived.sentMessage  != null)  _smsReceived.sentMessage = replace( _smsReceived.sentMessage, "+", " ");
  _smsReceived.receiverPhoneNumber = pick(req.query, ['Q']).Q;
   const result = await smsSubscriberService.receivedMessage(_smsReceived);
  res.send(result);
});
module.exports = {
  createSMSSubscriber,
  getSMSSubscribers,
  getSMSSubscriber,
  updateSMSSubscriber,
  deleteSMSSubscriber,
  sendNextVasMessagestoSMSSubscribers,
  sendNextVasMessagestoSMSSubscribersByPhoneNumber,
  receivedMessage,
    subscribeSMSSubscribers,
  sendWelcomeMessage,
};
