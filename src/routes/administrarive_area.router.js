const { Router } = require("express");
const { administrativeAreaController } = require('../controllers');

const administrativeAreaRouter = Router();

administrativeAreaRouter.post('/', administrativeAreaController.add);

administrativeAreaRouter.delete('/:main_name', administrativeAreaController.destroy);

administrativeAreaRouter.get('/', administrativeAreaController.getAll);

module.exports = administrativeAreaRouter;