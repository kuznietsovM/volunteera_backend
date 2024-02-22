const { sequelize } = require("../utils");
const Sequelize = require('sequelize');

module.exports = sequelize.define(
    "Recipient",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        first_name: {
            type: Sequelize.STRING(32),
        },
        last_name: {
            type: Sequelize.STRING(32),
        },
        patronymic: {
            type: Sequelize.STRING(32),
        },
        phone_number: {
            type: Sequelize.STRING(12),
            allowNull: false,
            unique: true
        }, 
        // is_activated: {
        //     type: Sequelize.BOOLEAN,
        //     defaultValue: false
        // }
    },
    {
        // options
        sequelize,
        modelName: "Recipient",
        tableName: "Recipients",
        timestamps: false,
        underscore: true,
    }
);