require("dotenv").config();
const sequelize = require("../config/database");
const Auction = require("../models/Auction");
const User = require("../models/User");
const Bid = require("../models/Bid");

module.exports.getBidById = async (req, res) => {
  try {
    let { bidId } = req.params;
    const bid = Bid.findByPk(bidId, { include: Auction });
    return res.send(bid);
  } catch (err) {
    console.error(err);
  }
};

module.exports.getBidsByUser = async (req, res) => {
  try {
    let { userId } = req.params;
    if(!userId) return res.status(400).send("User ID must be provided");

    const user = User.findByPk(userId);
    if(!user) return res.status(404).send("User not found");

    const bids = await Bid.findAll({
      where: { UserId: userId },
      include: [{ model: User }],
      limit: limit,
      order: [["createdAt", "DESC"]],
    });

    return res.send(bids);
  }
  catch(err) {
    console.error("Error retrieving bids for user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getBidsByAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    if (!auctionId) {
      return res.status(400).send("Auction ID must be provided");
    }

    const auction = await Auction.findByPk(auctionId);
    if (!auction) {
      return res.status(404).send("Auction not found");
    }

    const bids = await Bid.findAll({
      where: { AuctionId: auctionId },
      include: [{ model: Auction }],
      limit: limit,
      order: [["createdAt", "DESC"]],
    });

    return res.json(bids);
  } catch (err) {
    console.error("Error retrieving bids for auction:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.addBid = async (req, res) => {
  try {
    const userId = req.currentUser.id;

    if (!req.body.BidAmount || isNaN(parseInt(req.body.BidAmount))) {
      return res.status(400).send("Valid bid amount must be provided");
    }

    const bidAmount = parseInt(req.body.BidAmount);
    const auctionId = req.body.auctionId;

    if (!auctionId) {
      return res.status(400).send("Auction ID must be provided");
    }

    const t = await sequelize.transaction();
    const auction = await Auction.findByPk(auctionId);

    if (!auction) {
      return res.status(404).send("Auction not found");
    }

    if(new Date(auction.startDate) > new Date()) {
      return res.status(400).send("Auction has not started yet");
    }

    if(new Date(auction.endDate) < new Date()) {
      return res.status(400).send("Auction has not started yet");
    }

    if (bidAmount <= auction.highestBid) {
      return res.status(400).send("Bid amount must be greater than the highest bid");
    }

    auction.highestBid = bidAmount;

    const bid = await Bid.create(
      {
        BidAmount: bidAmount,
        UserId: userId,
        AuctionId: auctionId,
      },
      { transaction: t }
    );

    await t.commit();
    return res.send(bid);
  } catch (err) {
    await t.rollback();
    console.error("Error adding bid:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.removeBid = async (req, res) => {
  try {
    const bidId = req.params.id;
    await Bid.destroy({ where: { id: bidId } });
    return res.send("Bid deleted successfully");
  } catch (err) {
    console.error("Error adding bid:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
