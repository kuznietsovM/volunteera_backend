const { administrativeAreaService } = require('../services');

const add = async (req,res) => {
    try{
        const administrarive_areas = await administrativeAreaService.create(req.body);
        res.status(201).json({
            result: administrarive_areas.map(record => record.toJSON()),
            status: "OK",
            message: "Success!",
        });
    } catch (e) {
        res.status(500).send({
            result: {},
            status: "DB_ERROR",
            message: e.message,
        });
    }
};

const destroy = async (req,res) => {
    try{
        const name = req.params['main_name'];
        await administrativeAreaService.destroy(name);
        res.status(200).json({ //code 204?
            result: "",
            status: "OK",
            message: "Success!"
        });
    } catch (e) {
        res.status(500).send({
            result: {},
            status: "DB_ERROR",
            message: e.message,
        });
    }
};

const getAll = async (req, res) => {
    try{
        const administrativeAreas = await administrativeAreaService.getAll();
        if(administrativeAreas){
            res.status(200).json({ 
                result: administrativeAreas.map(record => record.toJSON()),
                status: "OK",
                message: "Success!"
            });
        } else {
            res.status(404).send({
                result:{},
                status: "NOT_FOUND",
                message: "Found no administrative areas"
              });
        }
    } catch (e) {
        res.status(500).send({
            result: {},
            status: "DB_ERROR",
            message: e.message,
        });
    }
}

module.exports = {
    add,
    destroy,
    getAll
};