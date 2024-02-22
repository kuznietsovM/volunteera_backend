const { Router } = require("express");
const { volunteerController } = require('../controllers');
const { jwtMiddleware } = require("../middlewares");

const volunteerRouter = Router();

//verify volunteer every time he wants to open frontend
volunteerRouter.get('/verify', jwtMiddleware, volunteerController.verify);

module.exports = volunteerRouter;