const { Router } = require("express");
const { volunteerController, recipientController } = require('../controllers');
const { authMiddlware, jwtMiddleware } = require("../middlewares");

const authVolunteerRouter = Router();
const authRecipientRouter = Router();

authVolunteerRouter.post('/signup', volunteerController.signup);
authVolunteerRouter.post('/signin', volunteerController.signin);
authVolunteerRouter.post('/signout', jwtMiddleware, volunteerController.signout);
//activate account through link
authVolunteerRouter.get('/activate/:link', volunteerController.activate);
//resend activation link
authVolunteerRouter.get('/resend', jwtMiddleware, volunteerController.resend);
//refresh tokens
authVolunteerRouter.get('/refresh', volunteerController.refresh);
// authVolunteerRouter.post('/resetpassword');
// authVolunteerRouter.post('/forgotpassword');
// authVolunteerRouter.post('/deleteUser');
// authVolunteerRouter.post('/editData');

authRecipientRouter.post('/signin', recipientController.signin);
authRecipientRouter.post('/verify', recipientController.verifyCode);
authRecipientRouter.post('/refresh', recipientController.refresh);
authRecipientRouter.post('/signout', jwtMiddleware, recipientController.signout);

module.exports = {
    authVolunteerRouter,
    authRecipientRouter
}; 