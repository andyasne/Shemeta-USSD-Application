const httpStatus = require('http-status');
const { UserSession } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a userSession
 * @param {Object} userSessionBody
 * @returns {Promise<UserSession>}
 */
const createUserSession = async (userSessionBody) => {
  const userSession = await UserSession.create(userSessionBody);
  return userSession;
};

/**
 * Query for userSessions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUserSessions = async (filter, options) => {
  const userSessions = await UserSession.paginate(filter, options);
  return userSessions;
};
const getUserSessions = async () => {
  const userSessions = await UserSession.find({});
  return userSessions;
};
/**
 * Get userSession by id
 * @param {ObjectId} id
 * @returns {Promise<UserSession>}
 */
const getUserSessionById = async (id) => {
  return UserSession.findById(id);
};

/**
 * Update userSession by id
 * @param {ObjectId} userSessionId
 * @param {Object} updateBody
 * @returns {Promise<UserSession>}
 */
const updateUserSessionById = async (userSessionId, updateBody) => {
  const userSession = await getUserSessionById(userSessionId);
  if (!userSession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserSession not found');
  }
  Object.assign(userSession, updateBody);
  await userSession.save();
  return userSession;
};

/**
 * Delete userSession by id
 * @param {ObjectId} userSessionId
 * @returns {Promise<UserSession>}
 */
const deleteUserSessionById = async (userSessionId) => {
  const userSession = await getUserSessionById(userSessionId);
  if (!userSession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserSession not found');
  }
  await userSession.remove();
  return userSession;
};

module.exports = {
  createUserSession,
  queryUserSessions,
  getUserSessionById,
  getUserSessions,
  updateUserSessionById,
  deleteUserSessionById,
};
