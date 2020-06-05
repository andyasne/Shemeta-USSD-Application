const httpStatus = require('http-status');
const { pick } = require('lodash');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { displayTextService } = require('../services');

const createDisplayText = catchAsync(async (req, res) => {
  const displayText = await displayTextService.createDisplayText(req.body);
  res.status(httpStatus.CREATED).send(displayText);
});

const getDisplayTexts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['defaultLanguage']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await displayTextService.queryDisplayTexts(filter, options);
  res.send(result);
});

const getDisplayText = catchAsync(async (req, res) => {
  const displayText = await displayTextService.getDisplayTextById(req.params.displayTextId);
  if (!displayText) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DisplayText not found for');
  }
  res.send(displayText);
});

const updateDisplayText = catchAsync(async (req, res) => {
  const displayText = await displayTextService.updateDisplayTextById(req.params.displayTextId, req.body);
  res.send(displayText);
});

const deleteDisplayText = catchAsync(async (req, res) => {
  await displayTextService.deleteDisplayTextById(req.params.displayTextId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDisplayText,
  getDisplayTexts,
  getDisplayText,
  updateDisplayText,
  deleteDisplayText,
};
