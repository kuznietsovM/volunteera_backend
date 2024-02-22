const { sequelize } = require("../utils");
const Sequelize = require("sequelize");

module.exports = sequelize.define(
    "Label",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING(64),
            allowNull: false,
            unique: true
        }
    },
    {
        // options
        sequelize,
        modelName: "Label",
        tableName: "Labels",
        timestamps: false,
        underscore: true,
    }
);