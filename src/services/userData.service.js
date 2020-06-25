const httpStatus = require('http-status');
const { UserData } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a userData
 * @param {Object} userDataBody
 * @returns {Promise<UserData>}
 */
const createUserData = async (userDataBody) => {
  const userData = await UserData.create(userDataBody);
  return userData;
};

/**
 * Query for userDatas
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUserDatas = async (filter, options) => {
  const userDatas = await UserData.paginate(filter, options);
  return userDatas;
};
const getUserDatas = async () => {
  const userDatas = await UserData.find({});
  return userDatas;
};
/**
 * Get userData by id
 * @param {ObjectId} id
 * @returns {Promise<UserData>}
 */
const getUserDataById = async (id) => {
  return UserData.findById(id);
};

/**
 * Update userData by id
 * @param {ObjectId} userDataId
 * @param {Object} updateBody
 * @returns {Promise<UserData>}
 */
const updateUserDataById = async (userDataId, updateBody) => {
  const userData = await getUserDataById(userDataId);
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserData not found');
  }
  Object.assign(userData, updateBody);
  await userData.save();
  return userData;
};

/**
 * Delete userData by id
 * @param {ObjectId} userDataId
 * @returns {Promise<UserData>}
 */
const deleteUserDataById = async (userDataId) => {
  const userData = await getUserDataById(userDataId);
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserData not found');
  }
  await userData.remove();
  return userData;
};

module.exports = {
  createUserData,
  queryUserDatas,
  getUserDataById,
  getUserDatas,
  updateUserDataById,
  deleteUserDataById,
};
