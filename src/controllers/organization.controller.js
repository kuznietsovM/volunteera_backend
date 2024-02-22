const { organizationService, pointService } = require("../services");
const path = require('node:path');

const create = async (req, res, next) => {
    try {
        const organizationData = await organizationService.create(req.body, req.file, req.user.id);
        console.log(req.file);
        res.status(200).json({
            data: organizationData,
            message: "SUCCESS"
        });
    } catch (e) {
        next(e);
    }
};

const edit = async (req, res, next) => {
    try {
        const organizationData = await organizationService.edit(req.body, req.file, req.user.id);
        res.status(200).json({
            data: organizationData,
            message: "SUCCESS"
        });
    } catch (e) {
        next(e);
    }
};

const getData = async (req, res, next) => {
    try {
        const organizationData = await organizationService.getData(req.user.id);
        res.status(200).json({
            data: organizationData,
            message: "SUCCESS"
        });
    } catch (e) {
        next(e);
    }
};

const getIcon = async (req, res, next) => {
    try {
        res.setHeader('Content-Type', 'image/png');
        res.sendFile(path.join(__dirname, '..', '/resources/icons/'+ req.params.name +'.png'));
    } catch (e) {
        next(e);
    }
};

const drop = async (req, res, next) => {
    try {

    } catch (e) {
        next(e);
    }
};

const getPoints = async(req, res, next) => {
    try{
      const userId = req.user.id;
      const points = await pointService.getOrganizationPoints(userId);
  
      res.status(200).json({
        data: points,
        message: "SUCCESS"
      });
    } catch (e) {
      next(e);
    }
  }

module.exports = {
    create,
    edit,
    getData,
    getIcon,
    drop,
    getPoints
}