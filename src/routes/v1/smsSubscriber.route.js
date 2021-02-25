const express = require('express');
const smsSubscriberController = require('../../controllers/smsSubscriber.controller');

const router = express.Router();

router.route('/').post(smsSubscriberController.createSMSSubscriber).get(smsSubscriberController.getSMSSubscribers);

router
  .route('/:smsSubscriberId')
  .get(smsSubscriberController.getSMSSubscriber)
  .patch(smsSubscriberController.updateSMSSubscriber)
  .delete(smsSubscriberController.deleteSMSSubscriber);

module.exports = router;
