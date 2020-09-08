/* eslint-disable no-param-reassign */
const loadash = require('lodash');

const smsTemplateService = require('./smsTemplate.service');
const smsLabelService = require('./smsLabel.service');
const ussdUserService = require('./ussdUser.service');
const smsMessageService = require('./smsMessage.service');
const smsTemplDataService = require('./smsTemplData.service');

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
  const smsTemplates = await smsTemplateService.getSMSTemplates();
  const labels = await smsLabelService.getSMSLabels();
  smsTemplates.forEach((templ) => {
    const templateLabel = loadash.find(
      labels,
      (v) => {
        if (v.id === templ.smsLabel.toString()) {
          return true;
        }
      },
      0
    );
    templ.smsLabel = templateLabel;
  });

  return smsTemplates;
};

async function getDefaultTemplateLabel(template, user) {
  const lbl = await smsLabelService.getSMSLabelById(template.smsLabel.toString());
  if (user.defaultLanguage === 'en') {
    return lbl.en;
  }
  if (user.defaultLanguage === 'am') {
    return lbl.en;
  }
}

function getTemplDataKey(templData) {
  return templData.key;
}

function getTemplDataVal(templData) {
  return templData.value;
}
async function sendMessage(builtMsg, to) {
  const val = `To:${to} , MSG:${builtMsg}`;
  // TODO: Add send message Logic Here
  to = val;
  return 'sent';
}

const sendSMSMessage = async (templateId, templateData, userId, to) => {
  const template = await smsTemplateService.getSMSTemplateById(templateId);
  const user = await ussdUserService.getUssdUserById(userId);
  const templateDataSave = await smsTemplDataService.createSMSTemplData(templateData);
  let builtMsg = await getDefaultTemplateLabel(template, user);

  templateData.data.forEach((templData) => {
    builtMsg = loadash.replace(builtMsg, getTemplDataKey(templData), getTemplDataVal(templData));
  });

  const sentStatus = await sendMessage(builtMsg, to);

  // build smsMsgobj and return
  const smsMsg = {
    smsTemplate: template._id,
    smsTemplData: templateDataSave._id,
    ussdUser: user._id,
    builtMessage: builtMsg,
    status: sentStatus,
    sentTime: new Date(),
    from: user.phoneNumber,
    sentTo: to,
  };

  const savedMsg = await smsMessageService.createSMSMessage(smsMsg);
  return savedMsg;
};

module.exports = {
  saveSMSTemplate,
  getAllSMSTemplate,
  sendSMSMessage,
};
