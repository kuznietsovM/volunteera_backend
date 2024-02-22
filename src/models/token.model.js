const { sequelize } = require("../utils");
const Sequelize = require("sequelize");

module.exports = sequelize.define(
  "Token",
  {
    volunteer_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      foreignKey: true,
    },
    refresh_token: { type: Sequelize.STRING(256), allowNull: false, unique: true }
  },
  {
    // options
    sequelize,
    modelName: "Token",
    tableName: "Tokens",
    timestamps: false,
    underscore: true,
  }
);