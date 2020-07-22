const httpStatus = require('http-status');
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

module.exports = {
  saveSMSTemplate,
  getAllSMSTemplate,
};
