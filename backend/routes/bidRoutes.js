require("dotenv").config();
const sequelize = require("../config/database");
const Auction = require("../models/Auction");
const User = require("../models/User");
const Bid = require("../models/Bid");
const pusher = require("../config/pusher");

module.exports.getBidById = async (req, res) => {
  try {
    let { id } = req.params;
    const bid = Bid.findByPk(id, { include: Auction });
    return res.send(bid);
  } catch (err) {
    console.error(err);
  }
};

module.exports.getBidsByUser = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id) return res.status(400).send("User ID must be provided");

    const user = User.findByPk(id);
    if (!user) return res.status(404).send("User not found");

    const bids = await Bid.findAll({
      where: { UserId: id },
      include: [{ model: User }],
      limit: limit,
      order: [["createdAt", "DESC"]],
    });

    return res.send(bids);
  } catch (err) {
    console.error("Error retrieving bids for user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getBidsByAuction = async (req, res) => {
  try {
    const { id } = req.params;
    // const limit = parseInt(req.query.limit) || 10;

    if (!id) {
      return res.status(400).send("Auction ID must be provided");
    }

    const auction = await Auction.findByPk(id);
    if (!auction) {
      return res.status(404).send("Auction not found");
    }

    const bids = await Bid.findAll({
      where: { AuctionId: id },
      include: [{ model: User }],
      // limit: limit,
      order: [["createdAt", "DESC"]],
    });

    return res.json(bids);
  } catch (err) {
    console.error("Error retrieving bids for auction:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.addBid = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.currentUser.id;

    if (!req.body.bidAmount || isNaN(parseInt(req.body.bidAmount))) {
      return res.status(400).send("Valid bid amount must be provided");
    }

    const bidAmount = parseInt(req.body.bidAmount);
    const auctionId = parseInt(req.body.auctionId);

    if (!auctionId) {
      return res.status(400).send("Auction ID must be provided");
    }

    const auction = await Auction.findByPk(auctionId);

    if (!auction) {
      return res.status(404).send("Auction not found");
    }

    const currentDate = new Date();
    if (new Date(auction.startDate) > currentDate) {
      return res.status(400).send("Auction has not started yet");
    }

    if (new Date(auction.endDate) < currentDate) {
      return res.status(400).send("Auction has ended");
    }

    if (auction.UserId === userId) {
      return res.status(400).send("bruh, you cannot bid on your own auction");
    }

    if (bidAmount <= auction.highestBid) {
      return res
        .status(400)
        .send("Bid amount must be greater than the highest bid");
    }

    auction.highestBid = bidAmount;
    let data = {
      bidAmount: bidAmount,
      userId: userId,
      auctionId: auctionId,
    };
    const User = req.currentUser;

    
    auction.save({ transaction: transaction });
    const bid = await Bid.create(data, { transaction: transaction });
    
    await transaction.commit();
    pusher.trigger(`auction_${auctionId}`, `add_bid`,{ ...data, User });
    return res.send({ ...bid.dataValues, User });
  } catch (err) {
    await transaction.rollback();
    console.error("Error adding bid:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.removeBid = async (req, res) => {
  try {
    const bidId = req.params.id;
    const transaction = await sequelize.transaction();
    const bid = await Bid.findByPk(bidId, { include: Auction });
    const last_two_bids = await Bid.findAll({
      where: { AuctionId: bid.AuctionId },
      order: [["createdAt", "DESC"]],
      limit: 2,
    });
    if (bid.Auction.highestBid === bid.bidAmount) {
      bid.Auction.highestBid = last_two_bids[1]?.bidAmount || 0;
      await bid.Auction.save({ transaction: transaction });
    }
    await Bid.destroy({ where: { id: bidId } }, { transaction: transaction });
    await transaction.commit();
    return res.send("Bid deleted successfully");
  } catch (err) {
    console.error("Error adding bid:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
