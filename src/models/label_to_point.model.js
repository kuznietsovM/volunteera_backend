const { sequelize } = require("../utils");

module.exports = sequelize.define(
    "LabelToPoint",
    {},
    {
        // options
        sequelize,
        modelName: "LabelToPoint",
        tableName: "LabelsToPoints",
        timestamps: false,
        underscore: true,
    }
);