const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { menuService } = require('../services');

const getFullMenuSet = catchAsync(async (req, res) => {
  const menu = await menuService.getFullMenuSet();
  res.status(httpStatus.FOUND).send(menu);
});
const saveFullMenuSet = catchAsync(async (req, res) => {
  const menuSet =  menuService.saveFullMenuSet(req.body);
  menuSet.then((ms)=>{
    getFullMenuSet(req,res);

  });
});

module.exports = {
  getFullMenuSet,
  saveFullMenuSet,
};
