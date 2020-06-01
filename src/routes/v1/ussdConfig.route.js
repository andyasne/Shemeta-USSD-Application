const express = require('express');
const ussdConfigController = require('../../controllers/ussdConfig.controller');

const router = express.Router();

router.post('/manageussdConfigs', ussdConfigController.createUSSDConfig);
router.get('/getussdConfigs', ussdConfigController.getUSSDConfigs);
router.get('/getussdConfig', ussdConfigController.getUSSDConfig);
router.patch('/manageussdConfigs', ussdConfigController.updateUSSDConfig);
router.delete('/manageussdConfigs', ussdConfigController.deleteUSSDConfig);

module.exports = router;
