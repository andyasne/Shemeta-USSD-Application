/* eslint-disable no-param-reassign */
const loadash = require('lodash');

const smsTemplateService = require('./smsTemplate.service');
const smsLabelService = require('./smsLabel.service');
const ussdUserService = require('./ussdUser.service');
const smsMessageService = require('./smsMessage.service');
const smsTemplDataService = require('./smsTemplData.service');
const axios = require('axios');

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
    return lbl.am;
  }
}

function getTemplDataKey(templData) {
  if (!loadash.isEmpty(templData)) return loadash.keys(templData)[0];
  return '';
}

function getTemplDataVal(templData) {
  if (!loadash.isEmpty(templData)) return loadash.values(templData)[0];
  return '';
}
async function sendMessage(builtMsg, to) {
  let SendURL = "http://localhost:13014/cgi-bin/sendsms?user=Alif@sms&password=Alif@123&to="+to+"&from=9039&text="+builtMsg;
  axios.get(SendURL)
  .then(response => {
    console.log(response.data.url);
    console.log(response.data.explanation);
    return 'Sent to '+ SendURL;
  })
  .catch(error => {
   return 'Error Sending '+error;
  });
    
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
  sendMessage,
};
