const { Router } = require("express");
const { pointController } = require('../controllers');
const { jwtMiddleware } = require('../middlewares');

const pointRouter = Router();

// TODO add middlewares

pointRouter.get('/', pointController.get); 

pointRouter.get('/:id', pointController.getOne);

pointRouter.post('/', jwtMiddleware, pointController.add);

pointRouter.patch('/:id', jwtMiddleware, pointController.patch);

pointRouter.delete('/:id', jwtMiddleware, pointController.destroy);

module.exports = pointRouter;