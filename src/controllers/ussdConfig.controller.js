const httpStatus = require('http-status');
const { pick } = require('lodash');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ussdConfigService } = require('../services');

const createUSSDConfig = catchAsync(async (req, res) => {
  const ussdConfig = await ussdConfigService.createUSSDConfig(req.body);
  res.status(httpStatus.CREATED).send(ussdConfig);
});

const getUSSDConfigs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['defaultLanguage']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await ussdConfigService.queryUSSDConfigs(filter, options);
  res.send(result);
});

const getUSSDConfig = catchAsync(async (req, res) => {
  const ussdConfig = await ussdConfigService.getUSSDConfigById(req.params.ussdConfigId);
  if (!ussdConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, 'USSDConfig not found');
  }
  res.send(ussdConfig);
});

const updateUSSDConfig = catchAsync(async (req, res) => {
  const ussdConfig = await ussdConfigService.updateUSSDConfigById(req.params.ussdConfigId, req.body);
  res.send(ussdConfig);
});

const deleteUSSDConfig = catchAsync(async (req, res) => {
  await ussdConfigService.deleteUSSDConfigById(req.params.ussdConfigId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUSSDConfig,
  getUSSDConfigs,
  getUSSDConfig,
  updateUSSDConfig,
  deleteUSSDConfig,
};
