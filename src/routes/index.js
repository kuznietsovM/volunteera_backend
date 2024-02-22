const { Router } = require("express");

const { authVolunteerRouter, authRecipientRouter } = require('./auth.router');
const volunteerRouter = require('./volunteer.router');
const recipientRouter = require('./recipient.router');
const organizationRouter = require('./organization.router');
const pointRouter = require('./point.router');
const administrativeArea = require("./administrarive_area.router");

const apiRouter = Router();

apiRouter.use('/volunteer/auth', authVolunteerRouter);
apiRouter.use('/volunteer', volunteerRouter);

apiRouter.use('/recipient/auth', authRecipientRouter);
apiRouter.use('/recipient', recipientRouter);

apiRouter.use('/organization', organizationRouter);

apiRouter.use('/points', pointRouter);

apiRouter.use('/administrativeAreas', administrativeArea);


module.exports = apiRouter; 
