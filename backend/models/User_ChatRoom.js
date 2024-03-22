const Sequelize = require("sequelize").Sequelize;
const sequelize = require("../config/database");
const User = require("../models/User");
const Chat_room = require("../models/Chat_room");

const User_ChatRoom = sequelize.define("User_ChatRoom", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  chat_roomId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = User_ChatRoom;
