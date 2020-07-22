const httpStatus = require('http-status');
const mongoose = require('mongoose');
const load = require('lodash');
const { SMSLabel } = require('../models');
const ApiError = require('../utils/ApiError');
const smsTemplateService = require('./smsTemplate.service');
const smsLabelService = require('./smsLabel.service');

const saveSMSTemplate = async (smsTemplate) => {
  const smsLabel = smsTemplate.label;
  delete smsTemplate.label;
  const label = await smsLabelService.createSMSLabel(smsLabel);
  smsTemplate.smsLabel = new mongoose.Types.ObjectId(SMSLabel.id);
  const template = await smsTemplateService.createSMSTemplate(smsTemplate);

  return {
    template,
    label,
  };
};

const getAllSMSTemplate = async () => {
  const smsTemplates = await smsTemplateService.getSMSTemplates();
  const labels = await smsLabelService.getSMSLabels();

  smsTemplates.forEach((templ) => {
    templ.label = load.find(
      labels,
      {
        id: teml.smsLabel.toString(),
      },
      0
    );
  });

  return smsTemplates;
};

module.exports = {
  saveSMSTemplate,
  getAllSMSTemplate,
};
