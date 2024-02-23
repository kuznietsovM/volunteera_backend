const { volunteerService } = require('../services');

const refreshTokenParams = {maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true} //httpOnly: true, secure: true

const signup = async(req, res, next) =>{
    try{
        const {email, first_name, last_name, password} = req.body;
        const {data, refreshToken} = await volunteerService.signup(email, first_name, last_name, password);

        res.cookie("refresh_token", refreshToken, refreshTokenParams);
        res.status(200).json({
            data,
            message: "SUCCESS"
        });
    } catch(e) {
        next(e);
    }
}

const signin = async(req, res, next) =>{
    try{
        const {email, password} = req.body;
        const {data, refreshToken} = await volunteerService.signin(email, password);

        res.cookie("refresh_token", refreshToken, refreshTokenParams);
        res.status(200).json({
            data,
            message: "SUCCESS"
        });
    } catch(e) {
        next(e);
    }
};

const signout = async(req, res, next) =>{
    try{
        await volunteerService.signout(req.user.id);

        res.clearCookie('refresh_token');
        res.status(200).json({
            data: {},
            message: "SUCCESS",
        });
    } catch(e) {
        next(e);
    }
}

const verify = async(req, res, next) =>{
    try{
        await volunteerService.verify(req.user.id);
        res.status(200).json({
            message: "SUCCESS",
        });
    } catch(e) {
        next(e);
    }
}

const resend = async(req, res, next) =>{
    try{
        await volunteerService.resend(req.user.id);
        res.status(200).json({
            data: {},
            message: "SUCCESS",
        });
    } catch(e) {
        next(e);
    }
}

const activate = async(req, res, next) =>{
    try{
        const activationLink = req.params.link;
        await volunteerService.activate(activationLink);
        return process.env.CLIENT_URL ? res.redirect(process.env.CLIENT_URL) : res.status(200).send('<h1>Activation success. Now you can sign in.</h1>');
    } catch(e) {
        next(e);
    }
}

const refresh = async(req, res, next) =>{
    try{
        const refreshTokenCookie = req.cookies.refresh_token;
        const {data, refreshToken} = await volunteerService.refresh(refreshTokenCookie);

        res.cookie("refresh_token", refreshToken, refreshTokenParams);
        res.status(200).json({
            data,
            message: "SUCCESS"
        });
    } catch(e) {
        next(e);
    }
}

module.exports = {
    signup,
    signin,
    signout,
    activate,
    verify,
    resend,
    refresh
}