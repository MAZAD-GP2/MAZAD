require("dotenv").config();
const Item = require("../models/Item");

module.exports.createItem = (req, res) => {
  res.send(req.currentUser);
  // try{const { name, description } = req.body;

  // const userId = req.currentUser.id;

  // const item = Item.create({name, description, userId});

  // }catch(err){
  //   res.send(err);
  // }
}