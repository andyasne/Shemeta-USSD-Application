const httpStatus = require('http-status');
const { VASMessage } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a vasMessage
 * @param {Object} vasMessageBody
 * @returns {Promise<VASMessage>}
 */
const createVASMessage = async (vasMessageBody) => {
  const vasMessage = await VASMessage.create(vasMessageBody);
  return vasMessage;
};

/**
 * Query for vasMessages
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const queryVASMessages = async (filter) => {
  const vasMessages = await VASMessage.find(filter);
  return vasMessages;
};
const getVASMessages = async () => {
  const vasMessages = await VASMessage.find({});
  return vasMessages;
};
/**
 * Get vasMessage by id
 * @param {ObjectId} id
 * @returns {Promise<VASMessage>}
 */
const getVASMessageById = async (id) => {
  return VASMessage.findById(id);
};

/**
 * Update vasMessage by id
 * @param {ObjectId} vasMessageId
 * @param {Object} updateBody
 * @returns {Promise<VASMessage>}
 */
const updateVASMessageById = async (vasMessageId, updateBody) => {
  const vasMessage = await getVASMessageById(vasMessageId);
  if (!vasMessage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'VASMessage not found');
  }
  Object.assign(vasMessage, updateBody);
  await vasMessage.save();
  return vasMessage;
};

/**
 * Delete vasMessage by id
 * @param {ObjectId} vasMessageId
 * @returns {Promise<VASMessage>}
 */
const deleteVASMessageById = async (vasMessageId) => {
  const vasMessage = await getVASMessageById(vasMessageId);
  if (!vasMessage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'VASMessage not found');
  }
  await vasMessage.remove();
  return vasMessage;
};

module.exports = {
  createVASMessage,
  queryVASMessages,
  getVASMessageById,
  getVASMessages,
  updateVASMessageById,
  deleteVASMessageById,
};
