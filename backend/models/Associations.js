const User = require("./User");
const Item = require("./Item");
const Bid = require("./Bid");
const Auction = require("./Auction");
const Category = require("./Category");
const Comment = require("./Comment");
const Message = require("./Message");

function relations() {
  User.hasMany(Item, { foreignKey: "userId", onDelete: "CASCADE" });
  Item.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

  User.hasMany(Bid, { foreignKey: "userId", onDelete: "CASCADE" });
  Bid.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

  Auction.hasMany(Bid, { foreignKey: "auctionId", onDelete: "CASCADE" });
  Bid.belongsTo(Auction, { foreignKey: "auctionId", onDelete: "CASCADE" });

  User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
  Comment.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

}

module.exports = relations;
