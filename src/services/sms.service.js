/* eslint-disable no-param-reassign */
const loadash = require('lodash');

const smsTemplateService = require('./smsTemplate.service');
const smsLabelService = require('./smsLabel.service');
const ussdUserService = require('./ussdUser.service');
const smsMessageService = require('./smsMessage.service');
const smsTemplDataService = require('./smsTemplData.service');
const sendingInfoLogger = require('../utils/logger').sendingInfoLogger;
const axios = require('axios');
const smsReceived = require('../models/smsReceived.model');
const { SMSSubscriber } = require('../models');

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


const showReceivedMessages = async () => {
  const smsReceivedMsgs = await smsReceived.find({});
  return smsReceivedMsgs;
   
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
function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}
async function sendMessage(builtMsg, to) {
  builtMsg = fixedEncodeURIComponent(builtMsg);
  let SendURL = "http://localhost:13014/cgi-bin/sendsms?user=Alif@sms&password=Alif@123&to=" + to + "&from=9039&text=" + builtMsg+"&coding=2&charset=UTF-8";
  axios.get(SendURL)
    .then(response => {
      console.log(response);
      let sentStatus = 'Sent with URL: ' + SendURL;
      let sendResult = saveSentInfo(builtMsg, sentStatus, to);

      sendingInfoLogger.log({
        level: 'info',
        message: sendResult
      });

      return sentStatus;
    })
    .catch(error => {
      let sentStatus = 'Error Sending ' + error;
      let sendResult = saveSentInfo(builtMsg, sentStatus, to);

      sendingInfoLogger.log({
        level: 'error',
        message: sendResult
      });

      return sentStatus;
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
 
  showReceivedMessages
};
function saveSentInfo(builtMsg, sentStatus, to) {
  const smsMsg = {


    status: sentStatus,
    sentTime: new Date(),
    from: '9039',
    sentTo: to,
    builtMessage: builtMsg
  };

  smsMessageService.createSMSMessage(smsMsg);
  return smsMsg;
}

