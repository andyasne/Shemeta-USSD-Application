const httpStatus = require('http-status');
const { replace } = require('lodash');
const { pick } = require('lodash');
const catchAsync = require('../utils/catchAsync');
const { smsService } = require('../services');
const { smsMessageService } = require('../services');
 
const smsReceived= require('../models/smsReceived.model');


const saveSMSTemplate = catchAsync(async (req, res) => {
  const menu = await smsService.saveSMSTemplate(req.body);
  res.status(httpStatus.OK).send(menu);
});

const sendSMSMessage = catchAsync(async (req, res) => {
  const resp = await smsService.sendSMSMessage(req.body.templateId, req.body.templateData, req.body.userId, req.body.to);
  res.status(httpStatus.OK).send(resp);
});

const getAllSMSTemplate = catchAsync(async (req, res) => {
  const templ = await smsService.getAllSMSTemplate();
  res.send(templ);
});

const getAllSentSMSMessages = catchAsync(async (req, res) => {
  const msgs = await smsMessageService.getSMSMessages();
  res.status(httpStatus.OK).send(msgs);
});

const receivedMessage = catchAsync(async (req, res) => {
  let _smsReceived = new smsReceived();
  _smsReceived.senderPhoneNumber = pick(req.query, ['p']).p;
  _smsReceived.sentTime = pick(req.query, ['t']).t;
  _smsReceived.sentMessage = pick(req.query, ['a']).a;
  if ( _smsReceived.sentMessage  != null)  _smsReceived.sentMessage = replace( _smsReceived.sentMessage, "+", " ");
  _smsReceived.receiverPhoneNumber = pick(req.query, ['Q']).Q;
   const result = await smsService.receivedMessage(_smsReceived);
  res.send(result);
});

module.exports = {
  saveSMSTemplate,
  getAllSMSTemplate,
  sendSMSMessage,
  getAllSentSMSMessages,
  receivedMessage
};
