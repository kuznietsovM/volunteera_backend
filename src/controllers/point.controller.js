const { pointService } = require("../services");
const { sequelize } = require("../utils");

const add = async (req, res, next) => {

  const transaction = await sequelize.transaction();

  try {
    const data = req.body;
    const userId = req.user.id;

    const point = await pointService.create(data, userId, transaction);

    await transaction.commit();

    res.status(201).json({
      data: point,
      message: "SUCCESS",
    });
  } catch (e) {
    await transaction.rollback();

    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const data = req.query;
    const points = await pointService.getByFilters(data);

    res.status(200).json({
      data: points,
      message: "SUCCESS",
    });

  } catch (e) {
    next(e);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const point = await pointService.getOne(id);

    res.status(200).json({
      data: point,
      message: "SUCCESS",
    });
  } catch (e) {
    next(e);
  }
};

const patch = async (req, res, next) => {

  const transaction = await sequelize.transaction();

  try{
    const { id } = req.params
    const data = req.body;
    const point = await pointService.patch(id, data, transaction);

    await transaction.commit();

    res.status(200).json({
      data: point,
      message: "SUCCESS"
    });
  } catch (e) {
    await transaction.rollback();
    next(e);
  }
}

const destroy = async(req, res, next) => {
  try{
    const { id } = req.params;
    await pointService.destroy(id);

    res.status(200).json({
      data: {},
      message: "SUCCESS"
    });
  } catch(e) {
    next(e);
  }
};

module.exports = {
  add,
  get,
  getOne,
  patch, 
  destroy
};
