const httpStatus = require('http-status');
const { pick } = require('lodash');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { vasMessageService } = require('../services');

const createVASMessage = catchAsync(async (req, res) => {
  const vasMessage = await vasMessageService.createVASMessage(req.body);
  res.status(httpStatus.CREATED).send(vasMessage);
});

const uploadVASMessages = catchAsync(async (req, res) => {
  const vasMessages = await vasMessageService.uploadVASMessages(req.body);
  res.status(httpStatus.CREATED).send(vasMessages);
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

const getNextVASMessage = catchAsync(async (req, res) => {
  const vasMessage = await vasMessageService.getNextVASMessage(req.params.currentVasMessageOrder);
  res.send(vasMessage);
});

module.exports = {
  createVASMessage,
  getVASMessages,
  getVASMessage,
  updateVASMessage,
  deleteVASMessage,
  getNextVASMessage,
  uploadVASMessages,
};
