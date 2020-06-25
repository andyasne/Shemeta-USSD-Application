const httpStatus = require('http-status');
const { pick } = require('lodash');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userDataService } = require('../services');

const createUserData = catchAsync(async (req, res) => {
  const userData = await userDataService.createUserData(req.body);
  res.status(httpStatus.CREATED).send(userData);
});

const getUserDatas = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['defaultLanguage']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userDataService.queryUserDatas(filter, options);
  res.send(result);
});

const getUserData = catchAsync(async (req, res) => {
  const userData = await userDataService.getUserDataById(req.params.userDataId);
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserData not found');
  }
  res.send(userData);
});

const updateUserData = catchAsync(async (req, res) => {
  const userData = await userDataService.updateUserDataById(req.params.userDataId, req.body);
  res.send(userData);
});

const deleteUserData = catchAsync(async (req, res) => {
  await userDataService.deleteUserDataById(req.params.userDataId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUserData,
  getUserDatas,
  getUserData,
  updateUserData,
  deleteUserData,
};
