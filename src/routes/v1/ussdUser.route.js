const express = require('express');
const ussdUserController = require('../../controllers/ussdUser.controller');

const router = express.Router();

router.route('/').post(ussdUserController.createUssdUser).get(ussdUserController.getUssdUsers);

router
  .route('/:ussdUserId')
  .get(ussdUserController.getUssdUser)
  .patch(ussdUserController.updateUssdUser)
  .delete(ussdUserController.deleteUssdUser);

module.exports = router;
