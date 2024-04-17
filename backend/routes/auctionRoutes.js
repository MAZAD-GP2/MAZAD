require("dotenv").config();
const sequelize = require("../config/database");
const User = require("../models/User");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");

module.exports.getAuctionById = async (req, res) => {
  try {
    let { auctionId } = req.params;
    const auction = Auction.findByPk(auctionId);
    return res.send(auction);
  } catch (err) {
    console.error(err);
  }
};

module.exports.getAuctionsByUser = async (req, res) => {
  try {
    let { userId } = req.params;
    if (!userId)
      return res.status(400).send("User ID must be provided");

    const user = User.findByPk(userId);
    if (!user) return res.status(404).send("User not found");

    const auctions = await Auction.findAll({
      where: { UserId: userId },
      include: [{ model: User }],
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

    if (new Date(startDate) < new Date()) {
      return res.status(400).send("Start date must be in the future");
    }
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).send("End date must be after start date");
    }
    if (price < 0 && isNaN(price)) {
      return res.status(400).send("Price must be a positive number");
    }

    Auction.create(
      {
        startTime: startDate,
        finishTime: endDate,
        highestBid: price,
        itemId: item.id,
      },
      { transaction: t }
    );

    await t.commit();
    return res.send(item);
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
    let { auctionId } = req.params;
    await Auction.destroy({ where: { id: auctionId } });
    return res.send("Auction deleted successfully");
  } catch (err) {
    console.error("Error deleting auction", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
