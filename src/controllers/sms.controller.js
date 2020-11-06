const httpStatus = require('http-status');
// const { pick } = require('lodash');
const catchAsync = require('../utils/catchAsync');
const { smsService } = require('../services');
const { smsMessageService } = require('../services');

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

module.exports = {
  saveSMSTemplate,
  getAllSMSTemplate,
  sendSMSMessage,
  getAllSentSMSMessages,
};
