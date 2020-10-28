const express = require('express');
const ussdConfigController = require('../../controllers/ussdConfig.controller');

const router = express.Router();

router.route('/').post(ussdConfigController.createUSSDConfig).get(ussdConfigController.getAllUSSDConfigs);

router
  .route('/:ussdConfigId')
  .get(ussdConfigController.getUSSDConfig)
  .patch(ussdConfigController.updateUSSDConfig)
  .delete(ussdConfigController.deleteUSSDConfig);

module.exports = router;
