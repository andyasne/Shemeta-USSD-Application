const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { menuService } = require('../services');

const getFullMenuSet = catchAsync(async (req, res) => {
  const menu = await menuService.getFullMenuSet();
  res.status(httpStatus.FOUND).send(menu);
});
const saveFullMenuSet = catchAsync(async (req, res) => {
  const menuSet = await menuService.saveFullMenuSet(req.body);
  res.status(httpStatus.CREATED).send(menuSet);
});

module.exports = {
  getFullMenuSet,
  saveFullMenuSet
};
