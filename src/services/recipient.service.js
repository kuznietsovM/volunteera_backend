const tokenService = require('./token.service');
const ApiError = require("../exceptions/api.error");

const { Recipient } = require('../models');
const { RecipientDto } = require('../dtos');


const generateAndSaveTokens = async(recipient) => {
    //const recipientDto = new RecipientDto(recipient);
    const tokens = tokenService.generateTokens({id: recipient.id});
    await tokenService.saveRefreshToken(recipient.id, tokens.refreshToken);

    return {
        data: {
            access_token: tokens.accessToken, 
        },
        refresh_token: tokens.refreshToken
    };
}

const signup = async (phoneNumber) => {
    const recipient = await Recipient.create({phone_number : phoneNumber});

    return recipient;
};

const findByPhoneNumber = async (phoneNumber) => {
    const recipient = Recipient.findOne({ 
        where:{
            phone_number: phoneNumber
        }
    });

    return recipient;
}

const findById = async (id) => {
    const recipient = Recipient.findByPk(id);
    if(!recipient) {
        throw ApiError.NotFoundError("RECIPIENT_NOT_FOUND");
    }

    return recipient;
}

const refresh = async(refreshToken) => {
    if(!refreshToken){
        throw ApiError.UnauthorizedError();
    }

    const payload = tokenService.validateRefreshToken(refreshToken);

    const refreshTokenFromDb = await tokenService.findRefreshToken(refreshToken);

    if(!payload || !refreshTokenFromDb) {
        throw ApiError.UnauthorizedError();
    }

    const recipient = await Recipient.findByPk(payload.id);
    const data = await generateAndSaveTokens(recipient);

    return data;
}

const signout = async(id) => {
    if(!id) {
        throw ApiError.BadRequestError("NO_RECIPIENT_ID");
    }
    await tokenService.removeRefreshToken(id);
}

const get = async(id) => {
    const recipient = await Recipient.findOne({
        where: {
            id: id
        }
    });

    if(!recipient){
        throw ApiError.NotFoundError("RECIPIENT_NOT_FOUND");
    }

    const recipientDto = new RecipientDto(recipient);

    return recipientDto;
}

const patch = async(id, data) => {
    const recipient = await Recipient.update(data, {
        where: {
            id: id
        },
        returning: true,
        plain: true
    });

    if(recipient[0] == 0) {                                     //0 rows updated
        throw ApiError.NotFoundError("RECIPIENT_NOT_FOUND");
    }
    const recipientDto = new RecipientDto(recipient[1]);

    return recipientDto;
}

module.exports = {
    signup,
    findByPhoneNumber,
    findById,
    generateAndSaveTokens,
    refresh,
    signout,
    get,
    patch
}