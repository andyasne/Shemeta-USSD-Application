const express = require('express');
const smsSubscriberController = require('../../controllers/smsSubscriber.controller');

const router = express.Router();

router.route('/').post(smsSubscriberController.createSMSSubscriber).get(smsSubscriberController.getSMSSubscribers);

router
  .route('/:smsSubscriberId')
  .get(smsSubscriberController.getSMSSubscriber)
  .patch(smsSubscriberController.updateSMSSubscriber)
  .delete(smsSubscriberController.deleteSMSSubscriber);

router.route('/sendNextVasMessages').post(smsSubscriberController.sendNextVasMessagestoSMSSubscribers);
router.route('/sendNextVasMessage').post(smsSubscriberController.sendNextVasMessagestoSMSSubscribersByPhoneNumber);
router.route('/subscribeSMSSubscribers').post(smsSubscriberController.subscribeSMSSubscribers);
router.route('/sendWelcomeMessage').post(smsSubscriberController.sendWelcomeMessage);
router.route('/receivedMessage').get(smsSubscriberController.receivedMessage);


module.exports = router;
