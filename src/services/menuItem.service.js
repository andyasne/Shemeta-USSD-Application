const httpStatus = require('http-status');
const { MenuItem } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a menuItem
 * @param {Object} menuItemBody
 * @returns {Promise<MenuItem>}
 */
const createMenuItem = async (menuItemBody) => {
  const menuItem = await MenuItem.create(menuItemBody);
  return menuItem;
};

/**
 * Query for menuItems
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const queryMenuItems = async (filter) => {
  const menuItems = await MenuItem.find(filter);
  return menuItems;
};
const getMenuItems = async () => {
  const menuItems = await MenuItem.find({});
  return menuItems;
};
/**
 * Get menuItem by id
 * @param {ObjectId} id
 * @returns {Promise<MenuItem>}
 */
const getMenuItemById = async (id) => {
  return MenuItem.findById(id);
};

/**
 * Update menuItem by id
 * @param {ObjectId} menuItemId
 * @param {Object} updateBody
 * @returns {Promise<MenuItem>}
 */
const updateMenuItemById = async (menuItemId, updateBody) => {
  const menuItem = await getMenuItemById(menuItemId);
  if (!menuItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MenuItem not found');
  }
  Object.assign(menuItem, updateBody);
  await menuItem.save();
  return menuItem;
};

/**
 * Delete menuItem by id
 * @param {ObjectId} menuItemId
 * @returns {Promise<MenuItem>}
 */
const deleteMenuItemById = async (menuItemId) => {
  const menuItem = await getMenuItemById(menuItemId);
  if (!menuItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MenuItem not found');
  }
  await menuItem.remove();
  return menuItem;
};

module.exports = {
  createMenuItem,
  queryMenuItems,
  getMenuItemById,
  getMenuItems,
  updateMenuItemById,
  deleteMenuItemById,
};
