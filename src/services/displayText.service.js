const httpStatus = require('http-status');
const { DisplayText } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a displayText
 * @param {Object} displayTextBody
 * @returns {Promise<DisplayText>}
 */
const createDisplayText = async (displayTextBody) => {
  const displayText = await DisplayText.create(displayTextBody);
  return displayText;
};

/**
 * Query for displayTexts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDisplayTexts = async (filter, options) => {
  const displayTexts = await DisplayText.paginate(filter, options);
  return displayTexts;
};
const getDisplayTexts = async () => {
  const displayTexts = await DisplayText.find({});
  return displayTexts;
};
/**
 * Get displayText by id
 * @param {ObjectId} id
 * @returns {Promise<DisplayText>}
 */
const getDisplayTextById = async (id) => {
  return DisplayText.findById(id);
};

/**
 * Update displayText by id
 * @param {ObjectId} displayTextId
 * @param {Object} updateBody
 * @returns {Promise<DisplayText>}
 */
const updateDisplayTextById = async (displayTextId, updateBody) => {
  const displayText = await getDisplayTextById(displayTextId);
  if (!displayText) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DisplayText not found');
  }
  Object.assign(displayText, updateBody);
  await displayText.save();
  return displayText;
};

/**
 * Delete displayText by id
 * @param {ObjectId} displayTextId
 * @returns {Promise<DisplayText>}
 */
const deleteDisplayTextById = async (displayTextId) => {
  const displayText = await getDisplayTextById(displayTextId);
  if (!displayText) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DisplayText not found');
  }
  await displayText.remove();
  return displayText;
};

module.exports = {
  createDisplayText,
  queryDisplayTexts,
  getDisplayTextById,
  getDisplayTexts,
  updateDisplayTextById,
  deleteDisplayTextById,
};
