const { Volunteer, Organization } = require("../models");
const { VolunteerDto, OrganizationDto } = require("../dtos");

const bcrypt = require("bcryptjs");
const uuid = require("uuid");

const tokenService = require("./token.service");
const mailService = require("./mail.service");
const ApiError = require("../exceptions/api.error");

const initTokensAndGetData = async(volunteer) => {
  const volunteerDto = new VolunteerDto(volunteer);
  const tokens = tokenService.generateTokens({...volunteerDto});

  await tokenService.saveRefreshToken(volunteer.id, tokens.refreshToken, true);
  console.log(tokens.refreshToken.length);

  return {
    data: {
      access_token: tokens.accessToken, 
      user: {
        email: volunteer.email,
        role: 0,
        first_name: volunteer.first_name,
        last_name: volunteer.last_name
      }
      
    },
    refreshToken: tokens.refreshToken
  };
}

const signup = async(email, firstName, lastName, password) => {
  if(await Volunteer.findOne({
    where: {email: email}
  })){
    throw ApiError.BadRequestError("EMAIL_IS_ALREADY_IN_USE");
  }

  const activationLink = uuid.v4();
  console.log(activationLink);
  await mailService.sendActivationMail(email, activationLink);

  const volunteer = await Volunteer.create({
    email: email,
    first_name: firstName, 
    last_name: lastName, 
    hashed_password: bcrypt.hashSync(password, 3),
    // is_activated: false,
    is_creator: true,
    activation_link: activationLink
  });
  
  const volunteerData = await initTokensAndGetData(volunteer);
  return volunteerData;
};

const signin = async(email, password) => {
  const volunteer = await Volunteer.findOne({
    where: {
      email: email
    }
  });
  if(!volunteer){
    throw ApiError.BadRequestError("USER_NOT_FOUND");
  }
  
  const isEqual = bcrypt.compareSync(password, volunteer.hashed_password);
  if(!isEqual){
    throw ApiError.BadRequestError("INVALID_PASSWORD");
  }

  const volunteerData = await initTokensAndGetData(volunteer);
  return volunteerData;
};

const signout = async(userId) => {
  await tokenService.removeRefreshTokenById(userId);
}

const activate = async(activationLink) => {
  const volunteer = await Volunteer.findOne({
    where: {
      activation_link: activationLink
    }
  });
  if (!volunteer) {
    throw ApiError.InvalidActivationLink();
  };
  volunteer.is_activated = true;
  volunteer.activation_link = null;
  await volunteer.save();
};

const verify = async(userId) => {
  const volunteer = await Volunteer.findOne({
    where: {
      id: userId
    }
  });
  if(!volunteer){
    throw ApiError.BadRequestError("USER_NOT_FOUND");
  }
  if(!volunteer.is_activated){
    throw ApiError.BadRequestError("EMAIL_IS_NOT_ACTIVATED");
  };

  const organization = await Organization.findOne({
    where: {
      creator_id: volunteer.id
    }
  });
  if(volunteer.is_creator && !organization){
    throw ApiError.BadRequestError("ORGANIZATION_NOT_FOUND");
  }
};

const resend = async(userId) => {
  const activationLink = uuid.v4();
  console.log("link:" + activationLink);

  const volunteer = await Volunteer.findByPk(userId);
  if (!volunteer) {
    throw ApiError.BadRequestError("USER_NOT_FOUND");
  }
  if(volunteer.is_activated){
    throw ApiError.BadRequestError("EMAIL_IS_ALREADY_ACTIVATED");
  }

  await mailService.sendActivationMail(volunteer.email, activationLink);

  volunteer.activation_link = activationLink;
  await volunteer.save();
};

const refresh = async(refreshToken) => {
  if(!refreshToken){
    throw ApiError.UnauthorizedError();
  }

  const payload = tokenService.validateRefreshToken(refreshToken);
  console.log(payload);
  const refreshTokenFromDb = await tokenService.findRefreshToken(refreshToken, true);
  console.log(refreshToken);
  if(!payload || !refreshTokenFromDb){
    throw ApiError.UnauthorizedError();
  }

  const volunteer = await Volunteer.findByPk(payload.id);
  const volunteerData = await initTokensAndGetData(volunteer);
  return volunteerData;
}

module.exports = {
  signup,
  signin,
  signout,
  activate,
  verify,
  resend,
  refresh
};
