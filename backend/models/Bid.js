const Sequelize = require("sequelize").Sequelize;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Bid = sequelize.define("Bid", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  bidAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  auctionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = Bid;
