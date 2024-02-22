const { sequelize } = require("../utils");
const Sequelize = require("sequelize");

module.exports = sequelize.define(
    "AdministrativeArea", 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        main_name : {
            type: Sequelize.STRING(64),
            allowNull: false,
            unique: true
        },
        variation_name_1 : {
            type: Sequelize.STRING(64),
            allowNull: true,
            unique: true
        },
        variation_name_2 : {
            type: Sequelize.STRING(64),
            allowNull: true,
            unique: true
        }
    },
    {
        sequelize,
        modelName: "AdministrativeArea",
        tableName: "AdministrativeAreas",
        timestamps: false,
        underscore: true,
    }
);