const express = require('express');
const displayTextController = require('../../controllers/displayText.controller');

const router = express.Router();

router.route('/').post(displayTextController.createDisplayText).get(displayTextController.getDisplayTexts);

router
  .route('/:displayTextId')
  .get(displayTextController.getDisplayText)
  .patch(displayTextController.updateDisplayText)
  .delete(displayTextController.deleteDisplayText);

module.exports = router;
