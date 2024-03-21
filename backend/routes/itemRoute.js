require("dotenv").config();
const Item = require("../models/Item");
const User = require("../models/User");
const Category = require("../models/Category");
const Tag = require("../models/Tag");

const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const app = require("../firebaseConfig");
const { getStorage } = require("firebase/storage");
const storage = getStorage(app);

module.exports.createItem = async (req, res) => {
  console.log("aaa");
  console.log(req.currentUser.id);
  
  try {
    console.log(req.body);
    const { name, description, startDate, endDate} = req.body;
    const { tagNames, images } = req.body; // assuming images is an array of files
    
    const userId = req.currentUser.id;

    // Step 1: Upload images to Firebase Storage and obtain URLs
    const imageURLs = await Promise.all(
      images.map(async (image) => {
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        return getDownloadURL(storageRef);
      })
    );
    const category = await Category.findOne({ where: { id: 2 } });
    if (!category) {
      return res.status(404).send("Category not found");
    }
    // Step 2: Create a new item in the Items table
    const item = await Item.create({
      name,
      description,
      startDate,
      endDate,
      userId,
      category,
    });

    // Step 3: Insert records into image_items table
    await Promise.all(
      imageURLs.map(async (url) => {
        await ImageItem.create({
          url,
          itemId: item.id,
        });
      })
    );

    // Step 4: Insert records into item_tags table

    const tags = await Promise.all(
      tagNames.map((tagName) => Tag.findOrCreate({ where: { name: tagName } }))
    );

    await Promise.all(
      tags.map(async ([tag]) => {
        await ItemTag.create({
          tagId: tag.id,
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

module.exports.getAllItemsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const items = await Category.findByPk(categoryId, { include: [Item] });

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
