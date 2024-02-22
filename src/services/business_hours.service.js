const { BusinessHours } = require('../models');
const { sequelizeArrayToJSON } = require('../utils');

const { Op } = require('sequelize');
const momentBuisnessTime = require('moment-business-time');
const momentTimeZone = require('moment-timezone');
const Moment = require('moment');
const ApiError = require('../exceptions/api.error');

const create = async (businessHoursData, point_id, transaction = null) => {

    for (const buisness_hour of businessHoursData) {
        buisness_hour.point_id = point_id;
    }

    const business_hours = await BusinessHours.bulkCreate(businessHoursData, { transaction: transaction });

    return sequelizeArrayToJSON(business_hours);
};

const get = async(point_id) => {
    const businessHours = await BusinessHours.findAll({
        where: {
            point_id: point_id
        },
        order: [
            ['weekday', 'ASC'],
            ['open_hours', 'ASC']
        ],
        attributes: ['id', 'weekday', 'open_hours', 'close_hours']
    });
    if(!businessHours.length){
        throw ApiError.NotFoundError("BUSINESS_HOURS_NOT_FOUND");
    }

    return businessHours;
};

const patch = async(data, pointId, transaction = null) => {
    for(i = 0; i < data.length; i++){
        data[i].point_id = pointId;
    }

    const businessHours = await BusinessHours.bulkCreate(data, {
        updateOnDuplicate: ["open_hours", "close_hours"],
        transaction: transaction
    });

    const businessHoursDto = sequelizeArrayToJSON(businessHours);

    return businessHoursDto;
}

const destroy = async(ids, transaction = null) => {
    const result = await BusinessHours.destroy({
        where: {
            id:{
                [Op.in]: ids
            }
        }
    }, {transaction : transaction});
    if(result == 0) {
        throw ApiError.NotFoundError("BUSINESS_HOURS_NOT_FOUND")
    }
}

const getNextTransition = async(buisness_hours, current_date, tz) => {

    const result = {};
    const next_state = {};

    momentBuisnessTime.locale('en',{
        workinghours: hoursSet(buisness_hours)
    });
    const dateInPointTimezone = momentTimeZone.utc(current_date).tz(tz);
    const currentWeekday = parseInt(Moment(current_date).format("d"));
    
    const { transition, moment } = momentBuisnessTime(dateInPointTimezone.format("YYYY-MM-DDTHH:mm:ss")).nextTransitionTime();

    next_state.weekday = parseInt(moment.format("d"));
    next_state.time = moment.format("HH:mm");
   
    if(currentWeekday == next_state.weekday){
        next_state.weekday = 7;                                         // today
    }else if(currentWeekday + 1 == next_state.weekday || currentWeekday - 6 == next_state.weekday) {    
        next_state.weekday = 8;                                         // tomorrow
    }

    result.is_open = (transition == 'close') ? true : false; 
    result.next_state = next_state;

    return result;
};

const hoursSet = (timeRanges) => {
    const workinghours = {
        0:null,
        1:null,
        2:null,
        3:null,
        4:null,
        5:null,
        6:null,
    }
    for(const timeRange of timeRanges){
        switch(timeRange.weekday){
            case 0:
                if(!workinghours[0]){
                    workinghours[0] = [];
                }
                workinghours[0].push(timeRange.open_hours);
                workinghours[0].push(timeRange.close_hours);
                break;
            case 1:
                if(!workinghours[1]){
                    workinghours[1] = [];
                }
                workinghours[1].push(timeRange.open_hours);
                workinghours[1].push(timeRange.close_hours);
                break;
            case 2:
                if(!workinghours[2]){
                    workinghours[2] = [];
                }
                workinghours[2].push(timeRange.open_hours);
                workinghours[2].push(timeRange.close_hours);
                break;
            case 3:
                if(!workinghours[3]){
                    workinghours[3] = [];
                }
                workinghours[3].push(timeRange.open_hours);
                workinghours[3].push(timeRange.close_hours);
                break;
            case 4:
                if(!workinghours[4]){
                    workinghours[4] = [];
                }
                workinghours[4].push(timeRange.open_hours);
                workinghours[4].push(timeRange.close_hours);
                break;
            case 5:
                if(!workinghours[5]){
                    workinghours[5] = [];
                }
                workinghours[5].push(timeRange.open_hours);
                workinghours[5].push(timeRange.close_hours);
                break;
            case 6:
                if(!workinghours[6]){
                    workinghours[6] = [];
                }
                workinghours[6].push(timeRange.open_hours);
                workinghours[6].push(timeRange.close_hours);
                break;
        }
    }
    
    return workinghours;
}

module.exports = {
    create,
    getNextTransition,
    get,
    patch,
    destroy
};