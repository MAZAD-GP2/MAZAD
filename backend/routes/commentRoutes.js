require("dotenv").config();
const sequelize = require("../config/database");
const Comment = require("../models/Comment");
const pusher = require("../config/pusher");

module.exports.getCommentsbyItemId = async (req, res) => {
  try {
    const { itemId } = req.params;
    const comments = await Comment.findAll({
      where: {
        itemId,
      },
    });

    res.send(comments);
  } catch (er) {
    res.send(er);
  }
};

module.exports.addComment = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const name = req.currentUser.username;
    const { itemId, content, auctionId } = req.body;
    const comment = await Comment.create({ content, userId, itemId });
    const user  = req.currentUser;
    comment.dataValues.User = user;
    pusher.trigger(`auction_${auctionId}`, `add_comment`,{ ...comment.dataValues, name });
    res.send({ ...comment.dataValues, name });
  } catch (err) {
    res.send(err);
  }
};

module.exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = Comment.findByPk(id);
    if (!comment) {
      throw new Error("comment not found");
    }
    await comment.destroy();
    return res.status(200).send("Comment successfully deleted.");
  } catch (err) {
    return res.send(err);
  }
};

module.exports.editComment = async (req, res) => {
  try {
    const { id, newContent } = req.body;
    const comment = await Comment.findByPk(id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    comment.content = newContent;
    await comment.save();
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
