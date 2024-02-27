const Sequelize = require("sequelize").Sequelize;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Auction = require("./Auction");

const Bid = sequelize.define("Bid", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    BidAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    AuctionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }

});

Bid.belongsTo(Auction, { as: "auction", onDelete: "CASCADE" });

module.exports = Bid;