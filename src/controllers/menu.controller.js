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

module.exports = {
  getFullMenuSet,
  saveFullMenuSet,
};
