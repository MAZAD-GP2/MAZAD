require("dotenv").config();
const sequelize = require("../config/database");
const Auction = require("../models/Auction");
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

module.exports.getBidsByAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    if (!auctionId) {
      return res.status(400).json({ message: "Auction ID must be provided" });
    }

    const auction = await Auction.findByPk(auctionId);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
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
      return res
        .status(400)
        .json({ message: "Valid bid amount must be provided" });
    }

    const bidAmount = parseInt(req.body.BidAmount);
    const auctionId = req.body.auctionId;

    if (!auctionId) {
      return res.status(400).json({ message: "Auction ID must be provided" });
    }

    const t = await sequelize.transaction();
    const auction = await Auction.findByPk(auctionId);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    if (bidAmount <= auction.highestBid) {
      return res
        .status(400)
        .json({ message: "Bid amount must be greater than the highest bid" });
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
