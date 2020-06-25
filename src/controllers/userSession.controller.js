const httpStatus = require('http-status');
const { pick } = require('lodash');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userSessionService } = require('../services');

const createUserSession = catchAsync(async (req, res) => {
  const userSession = await userSessionService.createUserSession(req.body);
  res.status(httpStatus.CREATED).send(userSession);
});

const getUserSessions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['defaultLanguage']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userSessionService.queryUserSessions(filter, options);
  res.send(result);
});

const getUserSession = catchAsync(async (req, res) => {
  const userSession = await userSessionService.getUserSessionById(req.params.userSessionId);
  if (!userSession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserSession not found');
  }
  res.send(userSession);
});

const updateUserSession = catchAsync(async (req, res) => {
  const userSession = await userSessionService.updateUserSessionById(req.params.userSessionId, req.body);
  res.send(userSession);
});

const deleteUserSession = catchAsync(async (req, res) => {
  await userSessionService.deleteUserSessionById(req.params.userSessionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUserSession,
  getUserSessions,
  getUserSession,
  updateUserSession,
  deleteUserSession,
};
