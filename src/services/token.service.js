const { Token, OneTimeToken, RecipientToken } = require("../models");
const { getDigitalCode } = require('node-verification-code');

const smsService = require('./sms.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ApiError = require('../exceptions/api.error');

const generateTokens = (payload) => {
    console.log("payload:"+payload);
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'}) 
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '1d'})
    
    return {accessToken, refreshToken}
}

const validateAccessToken = (accessToken) => {
    try {
        return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    } catch (e) {
        return null;
    }
}

const validateRefreshToken = (refreshToken) => {
    try {
        return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
        return null;
    }
}

const saveRefreshToken = async(userId, refreshToken, isVolunteer = false) => {
    
    let token;

    if(isVolunteer){
        token = await Token.findByPk(userId);
    }else{
        token = await RecipientToken.findByPk(userId);
    }
    
    if(token) {
        token.refresh_token = refreshToken;
        console.log("save");
        return token.save();
    }

    console.log("create");
    if(isVolunteer) {
        return Token.create({
            volunteer_id: userId,
            refresh_token: refreshToken
        });
    }
    
    return RecipientToken.create({
        recipient_id: userId,
        refresh_token: refreshToken
    });
}

const removeRefreshTokenById = async(userId) => {
    console.log("destroy");
    const token = await Token.findOne({
        where: {
            volunteer_id: userId
          }
    })
    if(token) {
        // throw ApiError.UnauthorizedError();
        token.destroy();
    }
}

const removeRefreshToken = async(refreshToken) => {
    console.log("destroy");
    let result;
    if(isVolunteer){
        result = await Token.destroy({
            where: {
                volunteer_id: userId
              }
        });
    }else{
        result =  await RecipientToken.destroy({
            where: {
                recipient_id: userId
              }
        });
    }  
    
    if(result == 0) {
        throw ApiError.UnauthorizedError();
    }
}

const findRefreshToken = async(refreshToken, isVolunteer = false) => {
    if(isVolunteer){
        return await Token.findOne({
            where: {
                refresh_token: refreshToken
              }
        });
    }
    return await RecipientToken.findOne({
        where: {
            refresh_token: refreshToken
          }
    });
}

const createOneTimeToken = async(recipient) => {
    let code = getDigitalCode(6);
    const messageText = `Ваш код верифікації: ${code}`
    const sms = await smsService.sendMessage([recipient.phone_number], process.env.SMS_SENDER, messageText);
    console.log(code.toString());
    console.log(sms);
    if(sms.response_code != 800){
        code = recipient.phone_number.slice(-6);
    }
    
    const hash_code = bcrypt.hashSync(code.toString());

    await OneTimeToken.destroy({
        where:{
            recipient_id: recipient.id
        } 
    });

    const oneTimeToken = await OneTimeToken.create({
        hash_code: hash_code,
        recipient_id: recipient.id
    });

    return oneTimeToken.id
}

const verifyCode = async(code_id, code) => {   

    const currentDate = new Date();               

    if(!code_id || !code || code.length != 6){
        throw ApiError.BadRequestError('INVALID_DATA');
    }

    const oneTimeToken = await OneTimeToken.findByPk(code_id);
    if(!oneTimeToken){
        throw ApiError.NotFoundError('CODE_NOT_FOUND');
    }

    if(oneTimeToken.expires_at < currentDate){
        await deleteOneTimeToken(code_id);
        throw ApiError.UnauthorizedError('CODE_EXPIRED');
    }

    const isEqual = bcrypt.compareSync(code, oneTimeToken.hash_code);
    if(isEqual){
        await deleteOneTimeToken(code_id);

        return oneTimeToken.recipient_id  
    }else{
        await oneTimeToken.increment('attempts', { by: -1 });
        if(oneTimeToken.attempts == 0) {
            await deleteOneTimeToken(code_id);
            throw ApiError.UnauthorizedError('ATTEMPTS_EXHAUSTED');
        }

        throw ApiError.UnauthorizedError('INVALID_CODE');
    }
}

const deleteOneTimeToken = async (id) => {
    return await OneTimeToken.destroy({
        where: {
            id: id
        }
    });
}

module.exports = {
    generateTokens,
    validateAccessToken,
    validateRefreshToken,
    saveRefreshToken,
    removeRefreshTokenById,
    removeRefreshToken,
    findRefreshToken,
    createOneTimeToken,
    verifyCode,
}