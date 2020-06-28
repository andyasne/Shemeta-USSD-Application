const express = require('express');
const menuController = require('../../controllers/menu.controller');

const router = express.Router();

router.route('/').get(menuController.getFullMenuSet).post(menuController.saveFullMenuSet);

router.route('/getNextMenu').get(menuController.getMenu);

module.exports = router;
