const { sequelize } = require("../utils");
const Sequelize = require("sequelize");

module.exports = sequelize.define(
  "BusinessHour",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    weekday: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    open_hours: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    close_hours: {
      type: Sequelize.STRING(5),
      allowNull: false,
    }
  },
  {
    // options
    sequelize,
    modelName: "BusinessHour",
    tableName: "BusinessHours",
    timestamps: false,
    underscore: true,
  }
);
