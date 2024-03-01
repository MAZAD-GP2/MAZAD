const Sequelize = require("sequelize").Sequelize;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Tag = sequelize.define("Tag", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Tag;
