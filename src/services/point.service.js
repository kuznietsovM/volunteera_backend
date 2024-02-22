const axios = require('axios');

const businessHoursService = require('./business_hours.service');
const labelToPointService = require('./label_to_point.service');
const ApiError = require("../exceptions/api.error");

const { Op } = require("sequelize");

const { Point, Label, Organization, BusinessHours, Volunteer } = require("../models");
const { sequelize, sequelizeArrayToJSON } = require("../utils");
const { PointDto } = require('../dtos');

const create = async(createData, userId, transaction = null ) => {

  let { point_data, business_hours_data, label_ids } = createData;

  const volunteer = await Volunteer.findByPk(userId, { transaction: transaction });

  if(!volunteer){
    throw ApiError.NotFoundError('USER_NOT_FOUND');
  }

  if(volunteer.organization_id) {
    point_data.organization_id = volunteer.organization_id;
  }else{
    throw ApiError.NotFoundError('ORGANIZATION_NOT_FOUND');
  }

  const url = "https://maps.googleapis.com/maps/api/timezone/json"

  const { data } = await axios.get(url, { 
    params: {
      location: point_data.lat +", "+ point_data.lng,
      timestamp: new Date().getTime()/1000,
      key: process.env.GOOGLE_API_KEY
  }});
  console.log(data);
  point_data.tz = data.timeZoneId;

  let point = await Point.create(point_data, { transaction: transaction });
  point = point.toJSON();

  point.business_hours = await businessHoursService.create(business_hours_data, point.id, transaction);

  point.labels = await labelToPointService.create(label_ids, point.id, transaction);

  const pointDto = new PointDto(point);

  return pointDto;
};

const getByFilters = async (data) => {

  const filters = [];

  if(data.administrative_area_id){
    filters.push({administrative_area_id: data.administrative_area_id });
  }

  // if(data.organization_id){
  //   filters.push({organization_id: data.organization_id});
  // }

  if(data.label_ids && data.label_ids.length){
    filters.push({
      id: 
        {[Op.in]: 
          [sequelize.literal(
                'SELECT "LabelsToPoints"."point_id" FROM "LabelsToPoints" ' +
                'WHERE ("LabelsToPoints"."label_id" IN ('+ data.label_ids +') ) ' +
                'GROUP BY "LabelsToPoints"."point_id" '+
                'HAVING COUNT ("LabelsToPoints"."label_id") >= '+ data.label_ids.length)
          ]
        }
    });
  }

  let points = await Point.findAll({
    include: [{  
      model: Organization,
      require: true,
      attributes: []
    },
    {
      model: Label,
      as: 'labels',
      require: true,
      attributes: ['id'],
      through: { attributes: [] }
    }
  ],
    where: {
      [Op.and] : 
        [filters]
    },
    attributes: ['id','lat', 'lng','administrative_area_id','region','locality','street', 'house_number', 'tz',[sequelize.col('Organization.name'), 'organization_name'], [sequelize.col('Organization.icon'), 'organization_icon']],
  });

  if(!points.length){
    throw ApiError.NotFoundError("POINTS_NOT_FOUND");
  }

  points = sequelizeArrayToJSON(points);
  const pointsDto = [];

    for (let point of points) {
      const business_hours = sequelizeArrayToJSON(await businessHoursService.get(point.id));
      const nextTransition =  await businessHoursService.getNextTransition(business_hours, new Date(), point.tz);
      point = Object.assign(point, nextTransition);

      pointsDto.push(new PointDto(point));
    }
    
  return pointsDto;
};

const getOne = async (pointId) =>{

  let point = await Point.findOne({
    include: [{
      model: Organization,
      require: true,
      attributes: []
    },
    {
      model: Label,
      as: 'labels',
      require: true,
      attributes: ['id'],
      through: { attributes: [] }
    }],
    where: {
      id: pointId
    },
    attributes: [
      'region','locality','street', 'house_number',
      'tz','administrative_area_id',
      [sequelize.col('Organization.name'), 'organization_name'],
      [sequelize.col('Organization.icon'), 'organization_icon'],
      [sequelize.col('Organization.description'), 'description'],
      [sequelize.col('Organization.website'), 'website'],
      [sequelize.col('Organization.number'), 'number'],
    ],
  });

  if(!point) {
    throw ApiError.NotFoundError("POINT_NOT_FOUND");
  }

  point = point.toJSON();
  point.business_hours = await businessHoursService.get(pointId);

  const nextTransition =  await businessHoursService.getNextTransition(sequelizeArrayToJSON(point.business_hours), new Date(), point.tz);
  point = Object.assign(point, nextTransition);

  const pointDto = new PointDto(point);

  return pointDto;
}

const patch = async (id, patchData, transaction = null) => {

  let point = {};

  if(patchData.point_data){
    let point_data = patchData.point_data;

    if(point_data.lat && point_data.lng){
      const url = "https://maps.googleapis.com/maps/api/timezone/json"
  
      const { data } = await axios.get(url, { 
        params: {
          location: point_data.lat +", "+ point_data.lng,
          timestamp: new Date().getTime()/1000,
          key: process.env.GOOGLE_API_KEY
      }});
  
      point_data.tz = data.timeZoneId;
    }
  
    point = await Point.update(point_data, {
      where: {
        id: id
      },
      returning: true,
      plain: true
    },{ transaction: transaction });
  
    if(point[0] == 0){
      throw ApiError.NotFoundError("POINT_NOT_FOUND");
    }

    point = point[1];
  }

  if(patchData.business_hours_data){
    point.business_hours = await businessHoursService.patch(patchData.business_hours_data, id, transaction);
  }

  if(patchData.deleted_business_hours_ids) {
    await businessHoursService.destroy(patchData.deleted_business_hours_ids, transaction);
  }

  if(patchData.labels) {
    point.labels = await labelToPointService.patch(patchData.labels, id, transaction);
  }

  const pointDto = new PointDto(point);

  return pointDto
}

const destroy = async(pointId) => {
  const result = await Point.destroy({
    where: {
      id: pointId
    }
  });

  if(result == 0) {
    throw ApiError.NotFoundError('POINT_NOT_FOUND');
  }
}

const getOrganizationPoints = async (userId) => {
  const volunteer = await Volunteer.findByPk(userId);

  if(!volunteer){
    throw ApiError.NotFoundError('USER_NOT_FOUND');
  }

  if(!volunteer.organization_id) {
    throw ApiError.NotFoundError('ORGANIZATION_NOT_FOUND');
  }
  console.log(volunteer.organization_id);

  let points = await Point.findAll({
    where: {
      organization_id: volunteer.organization_id
    }
  });

  points = sequelizeArrayToJSON(points);
  const pointsDto = [];

    for (let point of points) {
      point.business_hours = sequelizeArrayToJSON(await businessHoursService.get(point.id));

      pointsDto.push(new PointDto(point));
    }
    
  return pointsDto;

}

module.exports = {
  create,
  getByFilters,
  getOne,
  patch,
  destroy,
  getOrganizationPoints
};
