const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const ussdConfig = require('./ussdConfig.route');
const docsRoute = require('./docs.route');
const displayTextRoute = require('./displayText.route');
const menuItemRoute = require('./menuItem.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/ussdConfig', ussdConfig);
router.use('/docs', docsRoute);
router.use('/displayText', displayTextRoute);
router.use('/menuItem', menuItemRoute);

module.exports = router;
