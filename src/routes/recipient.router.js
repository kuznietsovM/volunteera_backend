const { Router } = require("express");
const { recipientController } = require('../controllers');
const { jwtMiddleware } = require("../middlewares");

const recipientRouter = Router();

recipientRouter.get('/', jwtMiddleware, recipientController.get);
recipientRouter.patch('/', jwtMiddleware, recipientController.patch);

module.exports = recipientRouter;