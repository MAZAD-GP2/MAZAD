require("dotenv").config();
const Item = require("../models/Item");
const User = require("../models/User");

module.exports.createItem = async (req, res) => {
  //res.send(req.currentUser);
  try {
    const { name, description } = req.body;

    const userId = req.currentUser.id;

    const item = await Item.create({ name, description, userId });
    res.send(item);
  } catch (err) {
    res.send(err);
  }
};

module.exports.getAllItemsByUserId = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const items = await Item.findAll({
      where: {
        userId,
      },
    });
    // const items=await User.findAll({include: [Item]})
    // const items=await Item.findAll({include: [User]})

    res.send(items);
  } catch (er) {
    res.send(er);
  }
};

module.exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.send(items);
  } catch (er) {
    res.send(er);
  }
};
