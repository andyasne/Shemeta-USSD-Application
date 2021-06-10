/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const loadash = require('lodash');

const httpStatus = require('http-status');
const { SMSSubscriber } = require('../models');

const ApiError = require('../utils/ApiError');
const vasMessageService = require('./vasMessage.service');
const smsService = require('./sms.service');
const smsTemplateService = require('./smsTemplate.service');
const smsLabelService = require('./smsLabel.service');
const smsReceived=  require('../models/smsReceived.model')
/**
 * Create a smsSubscriber
 * @param {Object} smsSubscriberBody
 * @returns {Promise<SMSSubscriber>}
 */
const createSMSSubscriber = async (smsSubscriberBody) => {
  
  const smsSubscriber = await SMSSubscriber.create(smsSubscriberBody);
  return smsSubscriber;
};

/**
 * Query for smsSubscribers
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const querySMSSubscribers = async (filter) => {
  const smsSubscribers = await SMSSubscriber.find(filter); 
  return smsSubscribers;
};

const querySMSSubscribersFindOne = async (filter) => {
  const smsSubscribers = await SMSSubscriber.findOne(filter); 
  return smsSubscribers;
};
const getSMSSubscribers = async () => {
  const smsSubscribers = await SMSSubscriber.find({}) ;
  return smsSubscribers;
};
/**
 * Get smsSubscriber by id
 * @param {ObjectId} id
 * @returns {Promise<SMSSubscriber>}
 */
const getSMSSubscriberById = async (id) => {
  var user = await SMSSubscriber.findById( id  );

 return await user.populate( 'lastSentVASMessage' ).execPopulate();
};
 

/**
 * Update smsSubscriber by id
 * @param {ObjectId} smsSubscriberId
 * @param {Object} updateBody
 * @returns {Promise<SMSSubscriber>}
 */
const updateSMSSubscriberById = async (smsSubscriberId, updateBody) => {
  const smsSubscriber = await getSMSSubscriberById(smsSubscriberId);
   
  if (!smsSubscriber) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SMSSubscriber not found');
  }
  Object.assign(smsSubscriber, updateBody);
  await smsSubscriber.save();
  return smsSubscriber;
};

/**
 * Delete smsSubscriber by id
 * @param {ObjectId} smsSubscriberId
 * @returns {Promise<SMSSubscriber>}
 */
const deleteSMSSubscriberById = async (smsSubscriberId) => {
  const smsSubscriber = await getSMSSubscriberById(smsSubscriberId);
  if (!smsSubscriber) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SMSSubscriber not found');
  }
  await smsSubscriber.remove();
  return smsSubscriber;
};
async function sendVasMessage(smsSubscriber, nextVasMessage) {
  const smsTemplate = await smsTemplateService.getSMSTemplateById(nextVasMessage.smsTemplate);
  const smsLabel = await smsLabelService.getSMSLabelById(smsTemplate.smsLabel);
  return   smsService.sendMessage(smsLabel.am, smsSubscriber.phoneNumber);
}

async function SendNextVasMessageToSmsSubscriber(smsSubscriber) {
  if (smsSubscriber.isActive) {
    let nextVasMessage;
    if (smsSubscriber.lastSentVASMessage === undefined) {
      nextVasMessage = await vasMessageService.getNextVASMessage(0); // SELECT THE FIRST MESSAGE
    } else {
      nextVasMessage = await vasMessageService.getVASMessageById(smsSubscriber.lastSentVASMessage);
      nextVasMessage = await vasMessageService.getNextVASMessage(Number(nextVasMessage.order));
    }

    if (nextVasMessage !== undefined) {
      // send messages here
      smsSubscriber.lastSentVASMessageResult = await sendVasMessage(smsSubscriber, nextVasMessage);
      // update smsSubscriberNextMessage
      // eslint-disable-next-line no-param-reassign
      smsSubscriber.lastSentVASMessage = new mongoose.Types.ObjectId(nextVasMessage.id);
    return  await (await (await updateSMSSubscriberById(smsSubscriber._id, smsSubscriber)).populate('lastSentVASMessage')).execPopulate();;
    } 
  }
}

const sendNextVasMessagestoSMSSubscribers = async () => {
  const smsSubscribers = await getSMSSubscribers();
  const promises = [];
     for (let i = 0; i < smsSubscribers.length; i++) {
    promises.push(  await SendNextVasMessageToSmsSubscriber( smsSubscribers[i]));
    }; 
  const results = await Promise.all(promises);
  return results;
};
const sendNextVasMessagestoSMSSubscriberByPhoneNumber = async (PhoneNumberFilter) => {
  const smsSubscribers = await querySMSSubscribersFindOne(PhoneNumberFilter);
  return  await SendNextVasMessageToSmsSubscriber(smsSubscribers);
 
};

const subscribeSMSSubscribers = async (smsSubscribers) => {
  const promises = [];
  for (let i = 0; i < smsSubscribers.length; i++) {
    smsSubscribers[i].subscribedDate = new Date();
    promises.push(updateSMSSubscriberById(smsSubscribers[i].id, smsSubscribers[i]));
  }
  const results = await Promise.all(promises);
  return results;
};

const sendWelcomeMessage = async (smsSubscribers) => {
  const wellcomeVasMessage = await vasMessageService.getNextVASMessage(0); // SELECT THE FIRST MESSAGE

  const promises = [];
  if(wellcomeVasMessage!==null){
  for (let i = 0; i < smsSubscribers.length; i++) {
    sendVasMessage(smsSubscribers[i], wellcomeVasMessage);
    smsSubscribers[i].lastSentVASMessage = new mongoose.Types.ObjectId(wellcomeVasMessage.id);
    promises.push(updateSMSSubscriberById(smsSubscribers[i].id, smsSubscribers[i]));
  }}
  const results = await Promise.all(promises);
  return results;
};
const receivedMessage = async (_smsReceived) => {

  const smsReceivedSaved = await smsReceived.create(_smsReceived);

  if (smsReceivedSaved.senderPhoneNumber != undefined && smsReceivedSaved.senderPhoneNumber.length > 9) {

    const trimmedPhoneNumber = smsReceivedSaved.senderPhoneNumber.substring(smsReceivedSaved.senderPhoneNumber.length - 9, smsReceivedSaved.senderPhoneNumber.length);

    if (smsReceivedSaved.sentMessage != undefined && smsReceivedSaved.sentMessage.length > 0) {
      const phoneFilter = { "phoneNumberTrim": trimmedPhoneNumber }

      let smsSubscriber ;
      
      let allSubs = await getSMSSubscribers();
    
      let shouldSkip = false;
      allSubs.forEach((sub)=>{
        if (shouldSkip) {
          return;
        }
        if(sub.phoneNumberTrim==trimmedPhoneNumber){
          smsSubscriber=sub;
          return;
        }

      });
     

      if (smsSubscriber==undefined) {
        smsSubscriber = await createSMSSubscriber( { "phoneNumber": smsReceivedSaved.senderPhoneNumber });
      }  

      if (smsSubscriber==undefined || smsSubscriber.isActive==false) {
        if(loadash.toLower(smsReceivedSaved.sentMessage) !== "ok") {
        //Send a Message Here: send OK 
        const query = {
          order: -1 
        };
       
        const senOkMessage = await vasMessageService.queryVASMessages(query,null); 
        if (senOkMessage.length !== 0) {
         sendVasMessage(smsSubscriber, senOkMessage[0]);
        
      }
      }
      }
      if (loadash.toLower(smsReceivedSaved.sentMessage) == "ok") {

        smsSubscriber.isActive = true;
       await updateSMSSubscriberById(smsSubscriber._id, smsSubscriber);
      }


      if (loadash.toLower(smsReceivedSaved.sentMessage) == "stop") {
        smsSubscriber.isActive = false;
        await   updateSMSSubscriberById(smsSubscriber._id, smsSubscriber);
      }
      // else{
      //   smsSubscriber.isActive = true;
      //   await updateSMSSubscriberById(smsSubscriber._id, smsSubscriber);
      // }
    }
  }
  return smsReceivedSaved;
};
module.exports = {
  createSMSSubscriber,
  querySMSSubscribers,
  getSMSSubscriberById,
  getSMSSubscribers,
  updateSMSSubscriberById,
  deleteSMSSubscriberById,
  querySMSSubscribersFindOne,
  receivedMessage,
  sendNextVasMessagestoSMSSubscribers, 
  sendNextVasMessagestoSMSSubscriberByPhoneNumber,
  subscribeSMSSubscribers,
  sendWelcomeMessage,
};

