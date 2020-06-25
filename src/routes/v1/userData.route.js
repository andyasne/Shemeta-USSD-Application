const express = require('express');
const userDataController = require('../../controllers/userData.controller');

const router = express.Router();

router.route('/').post(userDataController.createUserData).get(userDataController.getUserDatas);

router
  .route('/:userDataId')
  .get(userDataController.getUserData)
  .patch(userDataController.updateUserData)
  .delete(userDataController.deleteUserData);

module.exports = router;
