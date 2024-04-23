require("dotenv").config();
const Tag = require("../models/Tag");
const { Op } = require("sequelize");

module.exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.send(tags);
  } catch (er) {
    res.status(500).send({ message: "Error in Fetching tags" });
  }
};
module.exports.searchTags = async (req, res) => {
  try {
    if (!req.params.query.trim()) {
      return res.status(400).send({ message: "Query parameter is missing" });
    }

    const query = req.params.query.trim().split(" ").join("%");

    const tags = await Tag.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
    });
    res.send(tags);
  } catch (er) {
    res.status(500).send({ message: `Error in Fetching tags: ${er}` });
  }
};

module.exports.createTag = async (req, res) => {
  try {
    const { name } = req.body.trim();
    if (!name) {
      return res.status(400).send({ message: "Please provide a tag name" });
    }
    if (name.length < 2) {
      return res.status(400).send({
        message: "Tag name should be atleast 1 characters long",
      });
    }
    if (name.length > 12) {
      return res.status(400).send({
        message: "Tag name should be atmost 12 characters long",
      });
    }
    const tag = await Tag.create({ name });

    res.send(tag);
  } catch (err) {
    res.status(500).send({ message: "Error in Creating tag" });
  }
};

module.exports.deleteTag = async (req, res) => {
  try {
    const tagId = req.params.id;
    await Tag.destroy({ where: { id: tagId } });
    res.send({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error in Deleting tag" });
  }
};
