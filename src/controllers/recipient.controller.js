const { recipientService, tokenService } = require("../services");

const refreshTokenParams = { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true }; //secure: true

const signin = async (req, res, next) => {
  try {
    const { phone_number } = req.body;
    let recipient = await recipientService.findByPhoneNumber(phone_number);
    if (!recipient) {
      recipient = await recipientService.signup(phone_number);
    }
    const oneTimeToken = await tokenService.createOneTimeToken(recipient);
    res.status(201).json({
      data: { code_id: oneTimeToken },
      message: "SUCCESS",
    });
  } catch (e) {
    next(e);
  }
};

const verifyCode = async (req, res, next) => {
  try {
    const { code_id, code } = req.body;
    const recipientId = await tokenService.verifyCode(code_id, code);
    const recipient = await recipientService.findById(recipientId);

    const {data, refresh_token} = await recipientService.generateAndSaveTokens(recipient);
    res.cookie("refresh_token", refresh_token, refreshTokenParams);

    res.status(200).send({
      data: data,
      message: "SUCCESS",
    });
  } catch (e) {
    next(e);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    const { data, refresh_token } = await recipientService.refresh(refreshToken);

    res.cookie("refresh_token", refresh_token, refreshTokenParams);

    res.status(200).json({
      data: data,
      message: "SUCCESS",
    });
  } catch (e) {
    next(e);
  }
};

const signout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await recipientService.signout(id);

    res.clearCookie("refresh_token");
    res.status(200).json({
      data: {},
      message: "SUCCESS",
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const id = req.user.id;
    const recipient = await recipientService.get(id);
    res.status(200).json({
      data: recipient,
      message: "SUCCESS",
    });
  } catch (e) {
    next(e);
  }
};

const patch = async (req, res, next) => {
  try {
    const id = req.user.id;
    const data = req.body;
    const recipient = await recipientService.patch(id, data);

    res.status(200).json({
      data: recipient,
      message: "SUCCESS",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  signin,
  verifyCode,
  refresh,
  signout,
  get,
  patch,
};
