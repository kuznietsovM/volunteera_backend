const { sequelize } = require("../utils");
const Sequelize = require("sequelize");
const moment = require('moment');

module.exports = sequelize.define(
    "OneTimeToken",
    {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        hash_code: {
            type: Sequelize.STRING(64),
            allowNull: false
        },
        attempts: {
            type: Sequelize.INTEGER,
            defaultValue: 5
        },
        expires_at: {
            type: "TIMESTAMP",
            defaultValue: function(){
                return moment(new Date()).add(5,'m').toDate();
            },
            allowNull: false,
        }
    },
    {
        // options
        sequelize,
        modelName: "OneTimeToken",
        tableName: "OneTimeTokens",
        timestamps: false,
        underscore: true,
    }
);