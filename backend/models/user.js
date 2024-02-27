const Sequelize = require("sequelize").Sequelize;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Item = require("./Item");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { is: /^(07[789]\d{7})$/ },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

User.hasMany(Item, { as: 'items', onDelete: 'CASCADE' });

module.exports = User;
