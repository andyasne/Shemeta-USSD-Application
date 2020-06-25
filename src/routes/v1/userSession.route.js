const express = require('express');
const userSessionController = require('../../controllers/userSession.controller');

const router = express.Router();

router.route('/').post(userSessionController.createUserSession).get(userSessionController.getUserSessions);

router
  .route('/:userSessionId')
  .get(userSessionController.getUserSession)
  .patch(userSessionController.updateUserSession)
  .delete(userSessionController.deleteUserSession);

module.exports = router;
