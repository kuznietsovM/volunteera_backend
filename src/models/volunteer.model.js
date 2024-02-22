const { sequelize } = require("../utils");
const Sequelize = require("sequelize");

module.exports = sequelize.define(
  "Token",
  {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: { type: Sequelize.STRING(64), isEmail: true, allowNull: false, unique: true },
    hashed_password: { type: Sequelize.STRING(64), allowNull: false},
    is_activated: { type: Sequelize.BOOLEAN, defaultValue: false},
    first_name: { type: Sequelize.STRING(40), allowNull: false },
    last_name: { type: Sequelize.STRING(40), allowNull: false },
    patronymic: { type: Sequelize.STRING(40) },
    is_creator: { type: Sequelize.BOOLEAN, defaultValue: false}, //will be deleted with rights system implementation
    activation_link: {type: Sequelize.STRING(64)}
  },
  {
    // options
    sequelize,
    modelName: "Volunteer",
    tableName: "Volunteers",
    timestamps: false,
    underscore: true,
  }
);