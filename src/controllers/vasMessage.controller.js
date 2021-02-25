const httpStatus = require('http-status');
const { pick } = require('lodash');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { vasMessageService } = require('../services');

const createVASMessage = catchAsync(async (req, res) => {
  const vasMessage = await vasMessageService.createVASMessage(req.body);
  res.status(httpStatus.CREATED).send(vasMessage);
});

const getVASMessages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['defaultLanguage']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await vasMessageService.queryVASMessages(filter, options);
  res.send(result);
});

const getVASMessage = catchAsync(async (req, res) => {
  const vasMessage = await vasMessageService.getVASMessageById(req.params.vasMessageId);
  if (!vasMessage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'VASMessage not found');
  }
  res.send(vasMessage);
});

const updateVASMessage = catchAsync(async (req, res) => {
  const vasMessage = await vasMessageService.updateVASMessageById(req.params.vasMessageId, req.body);
  res.send(vasMessage);
});

const deleteVASMessage = catchAsync(async (req, res) => {
  await vasMessageService.deleteVASMessageById(req.params.vasMessageId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createVASMessage,
  getVASMessages,
  getVASMessage,
  updateVASMessage,
  deleteVASMessage,
};
