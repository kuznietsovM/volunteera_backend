const { Op } = require('sequelize');
const { LabelToPoint} = require('../models');
const { sequelizeArrayToJSON } = require('../utils');

const create = async(label_ids, point_id, transaction = null) =>{
    
    const data = [];
    for (const label_id of label_ids) {
        data.push({
          label_id: label_id,
          point_id: point_id,
        });
      }
    return await LabelToPoint.bulkCreate(data, { transaction: transaction });
};

const patch = async(label_ids, point_id , transaction = null) => {
  await LabelToPoint.destroy({
    where: {
      label_id:{
        [Op.in]: label_ids
      },
      point_id: point_id
    }
  },{ transaction: transaction });

  const labelsToPoint = await create(label_ids, point_id, transaction);

  return labelsToPoint;
};

module.exports = {
    create,
    patch
}