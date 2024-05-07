const Sequelize = require("sequelize").Sequelize;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Auction = sequelize.define("Auction", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  finishTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  highestBid: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  min_bid: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  showNumber: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "new",
  },
});

module.exports = Auction;
