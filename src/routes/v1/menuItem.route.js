const express = require('express');
const menuItemController = require('../../controllers/menuItem.controller');

const router = express.Router();

router.route('/').post(menuItemController.createMenuItem).get(menuItemController.getMenuItems);

router
  .route('/:menuItemId')
  .get(menuItemController.getMenuItem)
  .patch(menuItemController.updateMenuItem)
  .delete(menuItemController.deleteMenuItem);

module.exports = router;
