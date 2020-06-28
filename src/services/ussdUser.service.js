const httpStatus = require('http-status');
const { UssdUser } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a ussdUser
 * @param {Object} ussdUserBody
 * @returns {Promise<UssdUser>}
 */
const createUssdUser = async (ussdUserBody) => {
  const ussdUser = await UssdUser.create(ussdUserBody);
  return ussdUser;
};

/**
 * Query for ussdUsers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUssdUsers = async (filter, options) => {
  const ussdUsers = await UssdUser.paginate(filter, options);
  return ussdUsers;
};
const getUssdUsers = async () => {
  const ussdUsers = await UssdUser.find({});
  return ussdUsers;
};
/**
 * Get ussdUser by id
 * @param {ObjectId} id
 * @returns {Promise<UssdUser>}
 */
const getUssdUserById = async (id) => {
  return UssdUser.findById(id);
};

/**
 * Update ussdUser by id
 * @param {ObjectId} ussdUserId
 * @param {Object} updateBody
 * @returns {Promise<UssdUser>}
 */
const updateUssdUserById = async (ussdUserId, updateBody) => {
  const ussdUser = await getUssdUserById(ussdUserId);
  if (!ussdUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UssdUser not found');
  }
  Object.assign(ussdUser, updateBody);
  await ussdUser.save();
  return ussdUser;
};

/**
 * Delete ussdUser by id
 * @param {ObjectId} ussdUserId
 * @returns {Promise<UssdUser>}
 */
const deleteUssdUserById = async (ussdUserId) => {
  const ussdUser = await getUssdUserById(ussdUserId);
  if (!ussdUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UssdUser not found');
  }
  await ussdUser.remove();
  return ussdUser;
};
const getUssdUserByPhoneNumber = async (_phoneNumber) => {
  const q = { phoneNumber: _phoneNumber };
  return UssdUser.findOne(q);
};

module.exports = {
  createUssdUser,
  queryUssdUsers,
  getUssdUserById,
  getUssdUsers,
  updateUssdUserById,
  deleteUssdUserById,
  getUssdUserByPhoneNumber,
};
