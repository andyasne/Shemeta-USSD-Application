const express = require('express');
const smsController = require('../../controllers/sms.controller');

const router = express.Router();

router.route('/').get(smsController.getAllSMSTemplate).post(smsController.saveSMSTemplate);

// router.route('/getNextMenu').get(menuController.getMenu);
// router.route('/getUserData').get(menuController.getUserData);
// router.route('/getModelDefinitions').get(menuController.getModelDefinitions);

module.exports = router;
