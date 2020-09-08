const express = require('express');
const menuController = require('../../controllers/menu.controller');

const router = express.Router();

router.route('/').get(menuController.getFullMenuSet).post(menuController.saveFullMenuSet);

router.route('/getNextMenu').get(menuController.getMenu);

router.route('/getUserData').get(menuController.getUserData);
router.route('/getModelDefinitions').get(menuController.getModelDefinitions);

module.exports = router;
