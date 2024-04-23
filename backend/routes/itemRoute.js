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
const User = require("../models/User");
const Interest = require("../models/Interest");
const { Op } = require("sequelize");

const QuillDeltaToHtmlConverter =
  require("quill-delta-to-html").QuillDeltaToHtmlConverter;

module.exports.createItem = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let { name, description, startDate, endDate, tags, price, categoryId } =
      req.body;
    tags = tags.split(",").filter((tag) => tag.trim() !== "");
    price = parseFloat(price);
    if (!name || !description || !startDate || !endDate || !tags || !price) {
      return res.status(400).send({ message: "All fields are required" });
    }
    if (new Date(startDate) < new Date()) {
      return res
        .status(400)
        .send({ message: "Start date must be in the future" });
    }
    if (new Date(endDate) < new Date(startDate)) {
      return res
        .status(400)
        .send({ message: "End date must be after start date" });
    }
    if (tags.length > 3) {
      return res.status(400).send("Maximum 3 tags allowed");
    }
    if (price < 0 && isNaN(price)) {
      return res.status(400).send("Price must be a positive number");
    }

    const images = req.files;
    if (images.length < 1) {
      return res.status(400).send("At least one image is required");
    }
    if (images.length > 10) {
      return res.status(400).send("Maximum 10 images allowed");
    }
    const userId = req.currentUser.id;

    var deltaOps = JSON.parse(description);
    let descriptionText = deltaOps.map((op) => op.insert).join("");

    if (descriptionText.length > 1000) {
      return res.status(400).send("Description is too long");
    }
    var converter = new QuillDeltaToHtmlConverter(deltaOps);

    let htmlDescription = converter.convert();

    // remove all tags and check if it is empty
    if (description.replace(/<[^>]*>?/gm, "").trim() === "") {
      return res.status(400).send("Description cannot be empty");
    }

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

    // also sanitize tags to prevent XSS, hmm actually, theres no need (as long as we don't do .innerHTML or the equivalent)

    const item = await Item.create(
      {
        name,
        description,
        userId,
        categoryId,
      },
      { transaction: t }
    );

    Auction.create(
      {
        startTime: startDate,
        finishTime: endDate,
        highestBid: price,
        itemId: item.id,
      },
      { transaction: t }
    );

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
    return res.send(item);
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: err.message });
  }
};

module.exports.getItemById = async (req, res) => {
  const itemId = req.params.id;
  const user = req.currentUser;

  try {
    const item = await Item.findByPk(itemId, {
      include: [
        User,
        Category,
        {
          model: Tag,
          through: "Item_tag",
        },
        Image,
      ],
    });

    let interests;
    if (user) {
      interests = await Interest.findOne({
        where: {
          itemId: itemId,
          userId: user.id,
        },
      });
    }

    const itemValues = { item, interests };

    return res.send(itemValues);
  } catch (error) {
    return res.send(error);
  }
};

module.exports.getAllItemsByCategory = async (req, res) => {
  const user = req.currentUser;

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
      order: [["id", "DESC"]],
    });

    let interests = {};
    if (user) {
      await Promise.all(
        items.map(async (item) => {
          const interest = await Interest.findOne({
            where: {
              itemId: item.id,
              userId: user.id,
            },
          });
          interests[item.id] = interest ? true : false;
        })
      );
    }

    const itemsValues = { items, interests };

    return res.send(itemsValues);
  } catch (er) {
    return res.send(er);
  }
};
module.exports.getAllItems = async (req, res) => {
  const user = req.currentUser;
  let { status, categories, tags, minPrice, maxPrice, popularity } = req.query;

  try {
    let whereClause = {};
    let orderClause = [];
    // Apply filters if provided
    if (status && status !== "all") {
      if (status === "live") {
        whereClause["$Auction.startTime$"] = { [Op.lte]: new Date() };
      } else if (status === "upcoming") {
        whereClause["$Auction.startTime$"] = { [Op.gt]: new Date() };
      }
    }

    if (categories) {
      whereClause.categoryId = categories.split(",");
    }

    if (tags) {
      whereClause["$Tags.id$"] = tags.split(",");
    }

    if (minPrice) {
      minPrice = parseFloat(minPrice);
      whereClause["$Auction.highestBid$"] = { [Op.gte]: minPrice };
    }

    if (maxPrice) {
      maxPrice = parseFloat(maxPrice);
      whereClause["$Auction.highestBid$"] = { [Op.lt]: maxPrice };
    }

    if (popularity) {
      if (popularity === "heigh") {
        orderClause = [
          [sequelize.literal("interestsCount"), "DESC"],
          ...orderClause,
        ];
      } else if (popularity === "low") {
        orderClause = [
          [sequelize.literal("interestsCount"), "ASC"],
          ...orderClause,
        ];
      }
    }

    orderClause = [...orderClause, ["id", "DESC"]];

    let items = await Item.findAll({
      where: whereClause,
      include: [
        Category,
        {
          model: Tag,
          through: "Item_tag",
        },
        Image,
        {
          model: Auction,
          // we'll keep this commented out for now, but in the future, we don't want to show items that have already ended
          // where: {
          // itemId: sequelize.col("Item.id"),
          // finishTime: { [Op.gte]: new Date() } // Filter by auction finish time
          // },
        },
        {
          model: Interest,
          attributes: [],
          duplicating: false,
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM `Interests` WHERE `Interests`.`itemId` = `Item`.`id`)"
            ),
            "interestsCount",
          ],
        ],
      },
      order: orderClause,
    });

    if (user) {
      await Promise.all(
        items.map(async (item) => {
          const interest = await Interest.findOne({
            where: {
              itemId: item.id,
              userId: user.id,
            },
          });
          item.dataValues.isInterested = interest ? true : false;
        })
      );
    }

    return res.send(items);
  } catch (error) {
    return res.send(error);
  }
};

module.exports.getAllItemsByUserId = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 3;
    const skip = (page - 1) * limit;
    const items = await Item.findAndCountAll({
      where: {
        userId: req.currentUser.id,
      },
      offset: skip,
      limit: limit,
      order: [["id", "DESC"]],
    });

    return res.send(items);
  } catch (err) {
    return res.send(err);
  }
};

module.exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    await Item.destroy({ where: { id: itemId } });
    return res.send("successfully");
  } catch (err) {
    return res.send(err);
  }
};

module.exports.searchItem = async (req, res) => {
  const search = req.query.search;
  const user = req.currentUser;
  try {
    const items = await Item.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: "%" + search + "%" } },
          { "$Tags.name$": { [Op.like]: "%" + search + "%" } },
        ],
      },
      include: [
        Category,
        {
          model: Tag,
        },
        Image,
      ],
      order: [["id", "DESC"]],
    });

    let interests = {};
    if (user) {
      await Promise.all(
        items.map(async (item) => {
          const interest = await Interest.findOne({
            where: {
              itemId: item.id,
              userId: user.id,
            },
          });
          interests[item.id] = interest ? true : false;
        })
      );
    }

    const itemsValues = { items, interests };

    return res.send(itemsValues);
  } catch (err) {
    return res.status(400).send(err);
  }
};
