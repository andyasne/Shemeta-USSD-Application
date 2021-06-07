const express = require('express');
const smsSubscriberController = require('../../controllers/smsSubscriber.controller');

const router = express.Router();
 router.route('/').get(smsSubscriberController.receivedMessage);
 

module.exports = router;
