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
  res.status(httpStatus.FOUND).send(nextMenu);
});

module.exports = {
  getFullMenuSet,
  saveFullMenuSet,
  getMenu,
};
