const express = require('express');
const smsController = require('../../controllers/sms.controller');

const router = express.Router();

router.route('/template').get(smsController.getAllSMSTemplate).post(smsController.saveSMSTemplate);
router.route('/smsMessages').get(smsController.getAllSentSMSMessages);
router.route('/send').post(smsController.sendSMSMessage);

router.route('/showReceivedMessages').get(smsController.showReceivedMessages);


// router.route('/getUserData').get(menuController.getUserData);
// router.route('/getModelDefinitions').get(menuController.getModelDefinitions);

module.exports = router;
