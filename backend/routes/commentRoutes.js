require("dotenv").config();
const sequelize = require("../config/database");
const Comment = require("../models/Comment");

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
    const itemId = req.params;
    const userId = req.currentUser.id;
    const { content } = req.body;
    const comment = await Comment.create({ content, userId, itemId });
    res.send(comment);
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
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    const { newContent } = req.body;
    comment.content = newContent;
    await comment.save();
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
