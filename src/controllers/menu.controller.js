const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { menuService } = require('../services');

const getFullMenuSet = catchAsync(async (req, res) => {
  const menu = await menuService.getFullMenuSet();
  res.status(httpStatus.FOUND).send(menu);
});
const saveFullMenuSet = catchAsync(async (req, res) => {
  await menuService.saveFullMenuSet(req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

const getMenu = catchAsync(async (req, res) => {
  const nextMenu = await menuService.getMenu(req.query.sessionId, req.query.phoneNumber, req.query.selector);
  res.status(httpStatus.OK).send(nextMenu);
});
const getModelDefinitions = catchAsync(async (req, res) => {
  const menuDefinitions = menuService.getModelDefinitions();
  menuDefinitions.then((mdef) => {
    res.status(httpStatus.OK).send(mdef);
  });
});

const getUserData = catchAsync(async (req, res) => {
  const userDatas = menuService.getUserData();
  userDatas.then((userData) => {
    res.status(httpStatus.OK).send(userData);
  });
});

module.exports = {
  getFullMenuSet,
  saveFullMenuSet,
  getMenu,
  getModelDefinitions,
  getUserData,
};
