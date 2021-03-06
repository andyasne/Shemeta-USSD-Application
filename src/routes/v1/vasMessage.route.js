const express = require('express');
const vasMessageController = require('../../controllers/vasMessage.controller');

const router = express.Router();

router.route('/').post(vasMessageController.createVASMessage).get(vasMessageController.getVASMessages);

router
  .route('/:vasMessageId')
  .get(vasMessageController.getVASMessage)
  .patch(vasMessageController.updateVASMessage)
  .delete(vasMessageController.deleteVASMessage);

router.route('/NextVASMessage/:currentVasMessageOrder').get(vasMessageController.getNextVASMessage);

router.route('/uploadVASMessages').post(vasMessageController.uploadVASMessages);

module.exports = router;
