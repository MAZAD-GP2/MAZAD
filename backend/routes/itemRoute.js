require("dotenv").config();
const Item = require("../models/Item");
const User = require("../models/User");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const Image = require("../models/Image");
const Item_tag = require("../models/Item_tag");
const cloudinary = require("../config/cloudinaryConfig");

module.exports.createItem = async (req, res) => {
  try {
    let { name, description, startDate, endDate, tags } = req.body;
    const images = req.files;
    const userId = req.currentUser.id;
    tags = tags.split(",").filter((tag) => tag !== "");

    const item = await Item.create({
      name,
      description,
      startDate,
      endDate,
      userId,
      categoryId: 2,
    });
    
    const imageURLs = await Promise.all(
      images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.path);
        return result;
      })
    );

    await Promise.all(
      imageURLs.map(async (image) => {
        await Image.create({
          imgURL: image.url,
          itemId: item.id,
        });
      })
    );

    const ttags = await Promise.all(tags.map((tag) => Tag.findOrCreate({ where: { name: tag } })));

    await Promise.all(
      ttags.map(async (tag) => {
        await Item_tag.create({
          tagId: tag[0].id,
          itemId: item.id,
        });
      })
    );

    res.send(item);
  } catch (err) {
    res.send(err);
  }
};

module.exports.getAllItemsByUserId = async (req, res) => {
  try {
    const userId = req.currentUser;
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

module.exports.getAllItemsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const items = await Item.findAll({
      where: { categoryId },
      include: [
        Category,
        {
          model: Tag,
          through: "Item_tag",
        },
        Image
      ],
    });

    res.send(items);
  } catch (er) {
    res.send(er);
  }
};

module.exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [
        Category,
        {
          model: Tag,
          through: "Item_tag",
        },
        Image,
      ],
    });
    res.send(items);
  } catch (er) {
    res.send(er);
  }
};
