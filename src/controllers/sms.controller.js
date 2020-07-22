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
  const templateId = pick(req.body, ['templateId']);
  const templateData = pick(req.body, ['templateData']);
  const userId = pick(req.body, ['userId']);
  const to = pick(req.body, ['to']);
  const resp = await smsService.sendSMSMessage(templateId, templateData, userId, to);
  res.status(httpStatus.FOUND).send(resp);
});

module.exports = {
  saveSMSTemplate,
  getAllSMSTemplate,
  sendSMSMessage,
};
