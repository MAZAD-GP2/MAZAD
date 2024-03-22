const Sequelize = require("sequelize").Sequelize;
const sequelize = require("../config/database");
const Item = require("../models/Item");
const Tag = require("../models/Tag");

const Item_tag = sequelize.define("Item_tag", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  tagId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  itemId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Item_tag;
