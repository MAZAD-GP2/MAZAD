require("dotenv").config();
const Category = require("../models/Category");

module.exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.send(categories);
  } catch (er) {
    res.send(er);
  }
};

module.exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body.trim();
    if (!name) {
      return res.status(400).send({ message: "Please provide a category name" });
    }
    const category = await Category.create({ name });
    res.send(category);
  } catch (err) {
    res.send(err);
  }
};
