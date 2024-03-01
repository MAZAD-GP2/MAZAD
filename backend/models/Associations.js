const Sequelize = require("sequelize").Sequelize;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Item = require("./Item");
const Bid = require("./Bid");
const Auction = require("./Auction");
const Category = require("./Category");
const Comment = require("./Comment");
const Message = require("./Message");
const Interest = require("./Interest");
const Chat_room = require("./Chat_room");
const Image = require("./Image");
const Tag = require("./Tag");

function relations() {
  User.hasMany(Item, { foreignKey: "userId", onDelete: "CASCADE" });
  Item.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

  User.hasMany(Bid, { foreignKey: "userId", onDelete: "CASCADE" });
  Bid.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

  User.hasMany(Comment, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Comment.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  User.hasMany(Message, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Message.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  User.hasMany(Interest, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Interest.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  Item.hasMany(Interest, {
    foreignKey: "itemId",
    onDelete: "CASCADE",
  });
  Interest.belongsTo(Item, {
    foreignKey: "itemId",
    onDelete: "CASCADE",
  });

  Item.hasMany(Comment, {
    foreignKey: "itemId",
    onDelete: "CASCADE",
  });
  Comment.belongsTo(Item, {
    foreignKey: "itemId",
    onDelete: "CASCADE",
  });

  Item.hasOne(Auction, { foreignKey: "itemId" });
  Auction.belongsTo(Item, { foreignKey: "itemId" });

  Category.hasMany(Item, {
    foreignKey: "categoryId",
    onDelete: "CASCADE",
  });
  Item.belongsTo(Category, {
    foreignKey: "categoryId",
    onDelete: "CASCADE",
  });

  Auction.hasMany(Bid, {
    foreignKey: "auctionId",
    onDelete: "CASCADE",
  });
  Bid.belongsTo(Auction, {
    foreignKey: "auctionId",
    onDelete: "CASCADE",
  });

  Chat_room.hasMany(Message, {
    foreignKey: "chatRoomId",
    onDelete: "CASCADE",
  });
  Message.belongsTo(Chat_room, {
    foreignKey: "chatRoomId",
    onDelete: "CASCADE",
  });

  Item.hasMany(Image, {
    foreignKey: "itemId",
    onDelete: "CASCADE",
  });
  Image.belongsTo(Item, {
    foreignKey: "itemId",
    onDelete: "CASCADE",
  });

  const User_ChatRoom = sequelize.define("User_ChatRoom");
  User.belongsToMany(Chat_room, { through: User_ChatRoom });
  Chat_room.belongsToMany(User, { through: User_ChatRoom });

  const Item_tag = sequelize.define("Item_tag");
  Item.belongsToMany(Tag, { through: Item_tag });
  Tag.belongsToMany(Item, { through: Item_tag });
}

module.exports = relations;
