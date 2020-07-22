const httpStatus = require('http-status');
const { pick } = require('lodash');
const catchAsync = require('../utils/catchAsync');
const { smsService } = require('../services');

const saveSMSTemplate = catchAsync(async (req, res) => {
  const menu = await smsService.saveSMSTemplate(req.body);
  res.status(httpStatus.FOUND).send(menu);
});

const getAllSMSTemplate = catchAsync(async (req, res) => {
  const templ = await smsService.getAllSMSTemplate();
  res.status(httpStatus.FOUND).send(templ);
});

const sendSMSMessage = catchAsync(async (req, res) => {
   const resp = await smsService.sendSMSMessage(req.body.templateId, req.body.templateData, req.body.userId, req.body.to);
  res.status(httpStatus.FOUND).send(resp);
});

module.exports = {
  saveSMSTemplate,
  getAllSMSTemplate,
  sendSMSMessage,
};
