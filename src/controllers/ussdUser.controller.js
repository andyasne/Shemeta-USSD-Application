const httpStatus = require('http-status');
const { pick } = require('lodash');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ussdUserService } = require('../services');

const createUssdUser = catchAsync(async (req, res) => {
  const ussdUser = await ussdUserService.createUssdUser(req.body);
  res.status(httpStatus.CREATED).send(ussdUser);
});

const getUssdUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['defaultLanguage']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await ussdUserService.queryUssdUsers(filter, options);
  res.send(result);
});

const getUssdUser = catchAsync(async (req, res) => {
  const ussdUser = await ussdUserService.getUssdUserById(req.params.ussdUserId);
  if (!ussdUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UssdUser not found');
  }
  res.send(ussdUser);
});

const updateUssdUser = catchAsync(async (req, res) => {
  const ussdUser = await ussdUserService.updateUssdUserById(req.params.ussdUserId, req.body);
  res.send(ussdUser);
});

const deleteUssdUser = catchAsync(async (req, res) => {
  await ussdUserService.deleteUssdUserById(req.params.ussdUserId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUssdUser,
  getUssdUsers,
  getUssdUser,
  updateUssdUser,
  deleteUssdUser,
};
