const Sequelize = require("sequelize").Sequelize;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  Content:{
    type:DataTypes.STRING,
    allowNull:false
  },
  isSeen:{
    type: DataTypes.BOOLEAN,
    defaultValue:false    
  }
});
Message.belongsTo(User, { as: "sender", onDelete: "CASCADE" });
module.exports = Message;
