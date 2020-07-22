const httpStatus = require('http-status');
const mongoose = require('mongoose');
const load = require('lodash');
const {
  SMSLabel
} = require('../models');
const {
  SMSTemplate
} = require('../models');
const ApiError = require('../utils/ApiError');
const smsTemplateService = require('./smsTemplate.service');
const smsLabelService = require('./smsLabel.service');

const saveSMSTemplate = async (smsTemplate) => {
  const smsLabel = smsTemplate.smsLabel;
  delete smsTemplate.smsLabel;
  const label = await smsLabelService.createSMSLabel(smsLabel);
  smsTemplate.smsLabel = label._id;
  const template = await smsTemplateService.createSMSTemplate(smsTemplate);

  return {
    template,
    label,
  };
};

const getAllSMSTemplate = async () => {
  // let t = {additionalAttributes :"add"};
  // smsTemplateService.createSMSTemplate(t);
  //let l = {en:"Test"};
  //smsLabelService.createSMSLabel(l);

  let smsTemplates = await smsTemplateService.getSMSTemplates();
  const labels = await smsLabelService.getSMSLabels();

  smsTemplates.forEach((templ) => {
    let s = load.find(
      labels, (v) => {
        if (v.id === templ.smsLabel.toString()) {
          return true;
        }
      },
      0
    );
    templ.smsLabel = s;
  });

  return smsTemplates;
};

module.exports = {
  saveSMSTemplate,
  getAllSMSTemplate,
};
