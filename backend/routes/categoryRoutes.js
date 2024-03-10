require("dotenv").config();
const Category = require("../models/Category");

module.exports.getAllCategories = async (req, res) => {
  console.log("test");
  try {
    const categories = await Category.findAll();
    res.send(categories);
  } catch (er) {
    res.send(er);
  }
};

module.exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.send(category);
  } catch (err) {
    res.send(err);
  }
};
