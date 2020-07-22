/* eslint-disable no-param-reassign */
const load = require('lodash');

const smsTemplateService = require('./smsTemplate.service');
const smsLabelService = require('./smsLabel.service');

const saveSMSTemplate = async (smsTemplate) => {
  const { smsLabel } = smsTemplate;
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
  // let l = {en:"Test"};
  // smsLabelService.createSMSLabel(l);

  const smsTemplates = await smsTemplateService.getSMSTemplates();
  const labels = await smsLabelService.getSMSLabels();

  smsTemplates.forEach((templ) => {
    const s = load.find(
      labels,
      (v) => {
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
