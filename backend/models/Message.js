const Sequelize = require("sequelize").Sequelize;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  Content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isSeen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
module.exports = Message;
