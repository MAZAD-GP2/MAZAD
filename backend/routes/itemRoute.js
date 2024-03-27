require("dotenv").config();
const sequelize = require("../config/database");
const Item = require("../models/Item");
const Auction = require("../models/Auction");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const Image = require("../models/Image");
const Item_tag = require("../models/Item_tag");
const cloudinary = require("../config/cloudinaryConfig");
const sanitizeHtml = require("sanitize-html");

const QuillDeltaToHtmlConverter =
  require("quill-delta-to-html").QuillDeltaToHtmlConverter;

module.exports.createItem = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let { name, description, startDate, endDate, tags, categoryId } = req.body;
    const images = req.files;
    const userId = req.currentUser.id;

    var deltaOps = JSON.parse(description);
    let descriptionText = deltaOps.map((op) => op.insert).join("");

    if (descriptionText.length > 1000) {
      return res.status(400).send("Description is too long");
    }
    var converter = new QuillDeltaToHtmlConverter(deltaOps, {});

    let htmlDescription = converter.convert();
    description = sanitizeHtml(htmlDescription, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "b",
        "strong",
        "i",
      ]),
      allowedAttributes: {
        "*": ["style"],
      },
    });

    description = description.replace(/<br\s*\/?>\s*(<br\s*\/?>)+/g, "<br/>");

    tags = tags.split(",").filter((tag) => tag.trim() !== "");

    const item = await Item.create(
      {
        name,
        description,
        userId,
        categoryId,
      },
      { transaction: t }
    );

    Auction.create({ startTime: startDate, finishTime: endDate, itemId: item.id }, { transaction: t });

    const imageURLs = await Promise.all(
      images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.path);
        return result.url;
      })
    );

    await Image.bulkCreate(
      imageURLs.map((url) => ({
        imgURL: url,
        itemId: item.id,
      })),
      { transaction: t }
    );

    const tagOps = tags.map((tag) =>
      Tag.findOrCreate({ where: { name: tag.trim() }, transaction: t })
    );
    const createdTags = await Promise.all(tagOps);

    await Item_tag.bulkCreate(
      createdTags.map((tag) => ({
        tagId: tag[0].id,
        itemId: item.id,
      })),
      { transaction: t }
    );

    await t.commit();

    res.send(item);
  } catch (err) {
    await t.rollback();
    res.status(500).send({ err: err.message });
  }
};

module.exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [
        Category,
        {
          model: Tag,
          through: "Item_tag",
        },
        Image,
      ],
    });
    if (!item) {
      throw new Error("Item not found");
    }
    return res.send(item);
  } catch (error) {
    return res.send(error);
  }
};

module.exports.getAllItemsByUserId = async (req, res) => {
  try {
    const userId = req.currentUser;
    let items = await Item.findAll({
      where: {
        userId,
      },
    });
    // const items=await User.findAll({include: [Item]})
    // const items=await Item.findAll({include: [User]})

    //new items appear first
    items=items.reverse()

    res.send(items);
  } catch (er) {
    res.send(er);
  }
};

module.exports.getAllItemsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    let items = await Item.findAll({
      where: { categoryId },
      include: [
        Category,
        {
          model: Tag,
          through: "Item_tag",
        },
        Image,
      ],
    });

    //new items appear first
    items=items.reverse()
    
    res.send(items);
  } catch (er) {
    res.send(er);
  }
};

module.exports.getAllItems = async (req, res) => {
  try {
    let items = await Item.findAll({
      include: [
        Category,
        {
          model: Tag,
          through: "Item_tag",
        },
        Image,
      ],
    });
    
    //new items appear first
    items=items.reverse()

    res.send(items);
  } catch (er) {
    res.send(er);
  }
};
