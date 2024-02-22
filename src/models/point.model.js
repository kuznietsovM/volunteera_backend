const { sequelize } = require("../utils");
const Sequelize = require("sequelize");

module.exports = sequelize.define(
  "Point",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lat: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    lng: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    // formatted_address: {
    //   type: Sequelize.STRING(128),
    //   allowNull: true,
    // },
    tz: {
      type: Sequelize.STRING(64),
      allowNull: false
    },
    country: {
      type: Sequelize.STRING(64),
      allowNull: false,
    },
    // administrative_area_level_1: {
    //   type: Sequelize.STRING(64),
    //   allowNull: false,
    // },,
    region: {
      type: Sequelize.STRING(64),
      allowNull: false,
    },
    locality: {
      type: Sequelize.STRING(32),
      allowNull: false,
    },
    street: {
      type: Sequelize.STRING(64),
      allowNull: false,
      defaultValue: ''
    },
    house_number: {
      type: Sequelize.STRING(8),
      allowNull: false,
      defaultValue: ''
    },
  },
  {
    // options
    sequelize,
    modelName: "Point",
    tableName: "Points",
    timestamps: false,
    underscore: true,
  }
);