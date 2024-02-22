const { sequelize } = require("../utils");
const Sequelize = require("sequelize");

module.exports = sequelize.define(
  "Organization",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: Sequelize.STRING(64), allowNull: false, unique: true },
    number: { type: Sequelize.STRING(12), isNumeric: true}, //allowNull: false
    website: { type: Sequelize.STRING(64), isUrl: true },
    description: Sequelize.STRING(512), //allowNull: false
    icon: Sequelize.STRING(40),
    creator_id: {type: Sequelize.INTEGER, allowNull: false, foreignKey: true, unique: true}
  },
  {
    // options
    sequelize,
    modelName: "Organization",
    tableName: "Organizations",
    timestamps: false,
    underscore: true,
  }
);