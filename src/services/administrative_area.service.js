const { AdministrativeArea } = require("../models");

const create = (data) => {
    return AdministrativeArea.bulkCreate(data);
};

const destroy = (name) => {
    return AdministrativeArea.destroy({
        where: {
          main_name: name
        }
    });
};

const getAll = () => {
    return AdministrativeArea.findAll();
}

module.exports = {
    create,
    destroy,
    getAll
};