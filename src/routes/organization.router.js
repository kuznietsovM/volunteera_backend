const { Router } = require("express");
const { organizationController } = require("../controllers");
const { jwtMiddleware } = require("../middlewares");

const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

const organizationRouter = Router();

organizationRouter.post('/create', jwtMiddleware, upload.single('icon'), organizationController.create);

organizationRouter.post('/edit', jwtMiddleware, upload.single('icon'), organizationController.edit);

organizationRouter.get('/data', jwtMiddleware, organizationController.getData);

organizationRouter.get('/icon/:name', organizationController.getIcon);

// organizationRouter.post('/delete', jwtMiddleware, organizationController.drop);

organizationRouter.get('/points', jwtMiddleware, organizationController.getPoints);

module.exports = organizationRouter;