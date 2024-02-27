const Sequelize = require("sequelize").Sequelize;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Bid = require("./Bid");

const Auction = sequelize.define("Auction", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	startTime: {
		type: DataTypes.DATE,
		allowNull: false
	},
	finishTime: {
		type: DataTypes.DATE,
		allowNull: false
	},
	highestBid: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	}
});

module.exports = Auction;
