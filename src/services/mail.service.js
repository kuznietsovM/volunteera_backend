const nodemailer = require('nodemailer');
const ApiError = require("../exceptions/api.error");

const sendActivationMail = async (to, link) => {
    const host = process.env.API_URL ?? process.env.ORIGIN
    link = host + "/volunteer/auth/activate/" + link;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, //true
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Activate your account',
            html: `
                <h1>Activate your account for <a href="${process.env.ORIGIN}">Volunteera</a> web-service</h1>
                <p>Please click on the following link to activate your account:</p>
                <h3><a href="${link}">Activate</a></h3>
            `
        });
    } catch (error) {
        error.message = error.message.toUpperCase().split(' ').join('_');
        throw ApiError.BadRequestError(error.message, error);
    }
};

module.exports = {
    sendActivationMail
}