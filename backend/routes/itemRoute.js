require("dotenv").config();
const Item = require("../models/Item");
const User = require("../models/User");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const Image = require("../models/Image");
const admin = require("firebase-admin");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const app = require("../config/firebaseConfig");
const storage = getStorage(app);
const { readFileAsDataURL, dataURLtoBlob } = require("../utils/imageHandle");
const Item_tag = require("../models/Item_tag");

module.exports.createItem = async (req, res) => {
  try {
    let { name, description, startDate, endDate, tags } = req.body;
    const images = req.files;

    // return res.send([...images]);

    const userId = req.currentUser.id;
    tags = tags.split(",").filter((tag) => tag !== "");

    // Step 1: Upload images to Firebase Storage and obtain URLs
    // const imageURLs = await Promise.all(
    //   images.map(async (image) => {
    //     const imageDataURL = await readFileAsDataURL(image);
    //     const imageBlob = dataURLtoBlob(imageDataURL);
    //     const storageRef = ref(storage, `images/${image.originalname}`);
    //     await uploadBytes(storageRef, imageBlob);
    //     return getDownloadURL(storageRef);
    //   })
    // );
    // return res.send(imageURLs);
    // const category = await Category.findByPk(2);
    // if (!category) {
    //   return res.status(404).send("Category not found");
    // }
    // Step 2: Create a new item in the Items table
    const item = await Item.create({
      name,
      description,
      startDate,
      endDate,
      userId,
      categoryId: 1,
    });

    // Step 3: Insert records into image_items table
    // await Promise.all(
    //   imageURLs.map(async (url) => {
    //     await Image.create({
    //       url,
    //       itemId: item.id,
    //     });
    //   })
    // );

    // Step 4: Insert records into item_tags table

    const ttags = await Promise.all(
      tags.map((tag) => Tag.findOrCreate({ where: { name: tag } }))
    );

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
      ],
    });
    res.send(items);
  } catch (er) {
    res.send(er);
  }
};
