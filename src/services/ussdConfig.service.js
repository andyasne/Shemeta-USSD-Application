const httpStatus = require('http-status');
const { USSDConfig } = require('../models');
const ApiError = require('../utils/ApiError');
/**
 * Create a USSDConfig
 * @param {Object} USSDConfigBody
 * @returns {Promise<USSDConfig>}
 */
const createUSSDConfig = async (USSDConfigBody) => {
  const ussdConfig = await USSDConfig.create(USSDConfigBody);
  return ussdConfig;
};

/**
 * Query for USSDConfigs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryUSSDConfigs = async (filter, options) => {
  const ussdConfigs = await USSDConfig.paginate(filter, options);
  return ussdConfigs;
};
/**
 * Get USSDConfig by id
 * @param {ObjectId} id
 * @returns {Promise<USSDConfig>}
 */
const getUSSDConfigById = async (id) => {
  return USSDConfig.findById(id);
};
/**
 * Update USSDConfig by id
 * @param {ObjectId} USSDConfigId
 * @param {Object} updateBody
 * @returns {Promise<USSDConfig>}
 */
const updateUSSDConfigById = async (USSDConfigId, updateBody) => {
  const ussdConfig = await getUSSDConfigById(USSDConfigId);
  if (!ussdConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, 'USSDConfig not found');
  }
  Object.assign(ussdConfig, updateBody);
  await ussdConfig.save();
  return ussdConfig;
};
const getUSSDConfigs = async () => {
  const ussdConfigs = await USSDConfig.find({});
  return ussdConfigs;
};

const updateLastCode = async () => {
  const ussdConfigs = await getUSSDConfigs();
  let ussdConfig = null;

  if (ussdConfigs.length === 0 || ussdConfigs === undefined) {
    ussdConfig = new USSDConfig();
    ussdConfig.code = '0';
    ussdConfig = await createUSSDConfig(ussdConfig);
  } else {
    // eslint-disable-next-line prefer-destructuring
    ussdConfig = ussdConfigs[0];
  }
  let code = Number(ussdConfig.nextMenuCode);
  code += 1;
  ussdConfig.nextMenuCode = code.toString();
  await ussdConfig.save();
  return ussdConfig;
};

/**
 * Delete USSDConfig by id
 * @param {ObjectId} USSDConfigId
 * @returns {Promise<USSDConfig>}
 */
const deleteUSSDConfigById = async (USSDConfigId) => {
  const ussdConfig = await getUSSDConfigById(USSDConfigId);
  if (!ussdConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, 'USSDConfig not found');
  }
  await ussdConfig.remove();
  return ussdConfig;
};
module.exports = {
  createUSSDConfig,
  queryUSSDConfigs,
  getUSSDConfigById,
  updateUSSDConfigById,
  deleteUSSDConfigById,
  updateLastCode,
  getUSSDConfigs,
};
