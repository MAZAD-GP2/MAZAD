require("dotenv").config();
const sequelize = require("../config/database");
const User = require("../models/User");
const Item = require("../models/Item");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const moment = require('moment-timezone');

module.exports.getAuctionById = async (req, res) => {
  try {
    let { id } = req.params;
    const auction = Auction.findByPk(id);
    return res.send(auction);
  } catch (err) {
    console.error(err);
  }
};

module.exports.getAuctionsByUser = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id)
      return res.status(400).send("User ID must be provided");

    const user = User.findByPk(id);
    if (!user) return res.status(404).send("User not found");

    const auctions = await Auction.findAll({
      where: { UserId: id },
      include: [{ model: User }],
      limit: limit,
      order: [["createdAt", "DESC"]],
    });

    return res.send(auctions);
  } catch (err) {
    console.error(err);
  }
};

module.exports.getAuctionCountByUser = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id)
      return res.status(400).send("User ID must be provided");

    const user = User.findByPk(id);
    if (!user) return res.status(404).send("User not found");

    const auctionCount = await Auction.count({ where: { UserId: id } });

    return res.send({count: auctionCount});
  } catch (err) {
    console.error("Error retrieving auctton count for user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getAuctionsByItem = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id)
      return res.status(400).send("Item ID must be provided");

    const item = Item.findByPk(id);
    if (!item) return res.status(404).send("Item not found");

    const auctions = await Auction.findAll({
      where: { ItemId: id },
      include: [{ model: Item }],
      limit: limit,
      order: [["createdAt", "DESC"]],
    });

    return res.send(auctions);
  } catch (err) {
    console.error(err);
  }
};

module.exports.addAuction = async (req, res) => {
  try {
    let { itemId, startDate, endDate, price } = req.body;
    const userId = req.currentUser.id;
    const t = await sequelize.transaction();

    let now = moment().tz("Asia/Amman").format();

    if (new Date(startDate) < now) {
      return res.status(400).send("Start date must be in the future");
    }
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).send("End date must be after start date");
    }
    if (price < 0 && isNaN(price)) {
      return res.status(400).send("Price must be a positive number");
    }

    const auction = Auction.create(
      {
        startTime: startDate,
        finishTime: endDate,
        highestBid: price,
        itemId: itemId,
      },
      { transaction: t }
    );

    await t.commit();
    return res.send(auction);
  } catch (err) {
    await t.rollback();
    console.error("Error creating auction", err);
    return res.sendStatus(500);
  }
};

module.exports.updateAuction = async (req, res) => {
  try {
    let { auctionId, startDate, endDate, price } = req.body;
    const auction = await Auction.findByPk(auctionId);

    if (!auction) {
      return res.status(404).send("Auction not found");
    }

    await auction.update({
      startDate,
      endDate,
      price,
    });

    return res.send(auction);
  } catch (err) {
    console.error("Error creating auction", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.removeAuction = async (req, res) => {
  try {
    let { id } = req.params;
    await Auction.destroy({ where: { id: id } });
    return res.send("Auction deleted successfully");
  } catch (err) {
    console.error("Error deleting auction", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
