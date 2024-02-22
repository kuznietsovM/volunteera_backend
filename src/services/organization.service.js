const { Volunteer, Organization } = require("../models");
const { OrganizationDto } = require("../dtos");

const ApiError = require("../exceptions/api.error");
const path = require('node:path');
const sharp = require('sharp');
const uuid = require("uuid");

const create = async(data, image, volunteerId) => {
    if(!data.name || !data.number || !data.description) {
        throw ApiError.BadRequestError("NECESSARY_FIELDS_NOT_FILLED");
    }
    
    const volunteer = await Volunteer.findByPk(volunteerId);
    if (!volunteer){
        throw ApiError.BadRequestError("USER_NOT_FOUND");
    };
    if(!volunteer.is_activated){
        throw ApiError.BadRequestError("EMAIL_IS_NOT_ACTIVATED");
    };

    if(await Organization.findOne({
        where: {creator_id: volunteerId}
    })){
        throw ApiError.BadRequestError("ORGANIZATION_IS_ALREADY_EXIST");
    };
    if(await Organization.findOne({
        where: {name: data.name}
    })){
        throw ApiError.BadRequestError("NAME_IS_ALREADY_IN_USE");
    };

    if(image){
        const iconName = uuid.v4().replaceAll('-', '')
        data.icon = iconName;
        sharp(image.buffer)
        // .resize(400, 400, {fit: 'fill'})
        .toFile(path.join(__dirname, '..', '/resources/icons/'+ iconName +'.png'), function(error, sharp){
            if (error) {
                error.message = error.message.toUpperCase().split(' ').join('_');
                throw ApiError.BadRequestError(error.message, error);
            };
        });
        // throw ApiError.BadRequestError("INVALID_FILE_DATA");
    };
    
    data.creator_id = volunteerId;
    const organization = await Organization.create(data)

    volunteer.organization_id = organization.id;
    await volunteer.save()

    const organizationDto = new OrganizationDto(organization);
    return {...organizationDto};
};

const edit = async(data, image, volunteerId) => {
    if(data.creator_id || data.id){
        throw ApiError.BadRequestError("INVALID_FIELDS_FOR_EDITING");
    };

    const organization = await Organization.findOne({
        where: {
            creator_id: volunteerId
        }
    });
    if (!organization){
        throw ApiError.BadRequestError("ORGANIZATION_NOT_FOUND");
    };

    const otherOrganization = await Organization.findOne({
        where: {name: data.name}
    });
    if(data.name && otherOrganization && volunteerId != otherOrganization.creator_id){
        throw ApiError.BadRequestError("NAME_IS_ALREADY_IN_USE");
    };

    if(image){
        const iconName = organization.icon ?? uuid.v4().replaceAll('-', '')
        console.log("Path " + path.join(__dirname, '..', '/resources/icons/'+ iconName +'.png'));
        sharp(image.buffer)
            // .resize(400, 400, {fit: 'fill'})
            .toFile(path.join(__dirname, '..', '/resources/icons/'+ iconName +'.png'), function(error, sharp){
                if (error) {
                    error.message = error.message.toUpperCase().split(' ').join('_');
                    throw ApiError.BadRequestError(error.message, error);
                };
            });
        data.icon = iconName;
    }
    
    await organization.update(data);
    const organizationDto = new OrganizationDto(await organization.save());
    return {...organizationDto};
};

const getData = async(volunteerId) => {
    const volunteer = await Volunteer.findByPk(volunteerId);
    if (!volunteer){
        throw ApiError.BadRequestError("USER_NOT_FOUND");
    };

    const organization = await Organization.findByPk(volunteer.organization_id);
    if (!organization){
        throw ApiError.BadRequestError("ORGANIZATION_NOT_FOUND");
    };

    const organizationDto = new OrganizationDto(organization);
    return {...organizationDto};
};

module.exports = {
    create,
    edit,
    getData
}