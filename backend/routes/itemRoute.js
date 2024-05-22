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
const Bid = require("../models/Bid");
const Comment = require("../models/Comment");
const Interest = require("../models/Interest");
const { Op } = require("sequelize");
const moment = require("moment-timezone");

const QuillDeltaToHtmlConverter =
  require("quill-delta-to-html").QuillDeltaToHtmlConverter;

module.exports.createItem = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let {
      name,
      description,
      startDate,
      endDate,
      tags,
      price,
      categoryId,
      showNumber,
      isHidden,
      minBid,
    } = req.body;
    tags = tags.split(",").filter((tag) => tag.trim() !== "");
    price = parseFloat(price);
    if (
      !name ||
      !description ||
      !startDate ||
      !endDate ||
      !price === null ||
      !price === undefined ||
      !minBid === null ||
      !minBid === undefined
    ) {
      return res.status(400).send({ message: "All fields are required" });
    }

    let startDateObj = new Date(startDate);
    let endDateObj = new Date(endDate);
    let now = moment.tz("Asia/Amman").toDate();

    if (name.length > 255) {
      return res.status(400).send("Name is too long");
    }
    if (name.length < 3) {
      return res.status(400).send("Name is too short");
    }
    if (startDateObj < now) {
      return res
        .status(400)
        .send({ message: "Start date must be in the future" });
    }
    if (endDateObj < startDateObj) {
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
    if (showNumber === null || showNumber === undefined) {
      showNumber = false;
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
    isHidden = isHidden === "true" ? false : true;
    const item = await Item.create(
      {
        name,
        description,
        userId,
        categoryId,
        isHidden,
      },
      { transaction: t }
    );

    Auction.create(
      {
        startTime: startDate,
        finishTime: endDate,
        highestBid: price,
        itemId: item.id,
        showNumber: showNumber,
        min_bid: minBid,
        status: "pending",
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
  const userId = user ? user.id : null;
  const isAdmin = user ? user.isAdmin === true : false;

  if (isAdmin) {
    try {
      let item = await Item.findOne({
        where: {
          id: itemId,
        },
        include: [
          User,
          Category,
          {
            model: Tag,
            through: "Item_tag",
          },
          {
            model: Comment,
            include: [User],
            order: [["id", "DESC"]],
          },
          Image,
          {
            model: Auction,
            include: [
              {
                model: Bid,
                include: [User],
                order: [["createdAt", "DESC"]],
                limit: 1,
              },
            ],
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
      });
      const interest = await Interest.findOne({
        where: {
          itemId: itemId,
          userId: user.id,
        },
      });
      item.dataValues.isInterested = interest ? true : false;

      if (!item) {
        return res.status(404).send({});
      }
      return res.send({ item });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  try {
    let item = await Item.findOne({
      where: {
        id: itemId,
        [Op.or]: [{ isHidden: false }, { userId: userId }],
      },
      include: [
        User,
        Category,
        {
          model: Tag,
          through: "Item_tag",
        },
        {
          model: Comment,
          include: [User],
          order: [["id", "DESC"]],
        },
        Image,
        {
          model: Auction,
          where: {
            status: { [Op.not]: ["pending", "killed"] },
          },
          include: [
            {
              model: Bid,
              include: [User],
              order: [["createdAt", "DESC"]],
              limit: 1,
            },
          ],
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
    });
    if (!item) {
      return res.status(404).send({});
    }
    if (user) {
      const interest = await Interest.findOne({
        where: {
          itemId: itemId,
          userId: user.id,
        },
      });
      item.dataValues.isInterested = interest ? true : false;
    }
    
    return res.send({ item });
  } catch (error) {
    return res.send(error);
  }
};

module.exports.getAllItemsByFavorites = async (req, res) => {
  const user = req.currentUser;
  const userId = user.id;

  try {
    let items = await Item.findAll({
      where: { isHidden: false },
      include: [
        Category,
        {
          model: Tag,
          through: "Item_tag",
        },
        Image,
        {
          model: Auction,
        },
        {
          model: Interest,
          where: { userId },
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
      order: [["id", "DESC"]],
    });

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

    return res.send(items);
  } catch (er) {
    return res.send(er);
  }
};

module.exports.getAllItemsByCategory = async (req, res) => {
  const user = req.currentUser;

  try {
    const categoryId = req.params.id;
    let items = await Item.findAll({
      where: { categoryId, isHidden: false },
      include: [
        Category,
        {
          model: Tag,
          through: "Item_tag",
        },
        Image,
        {
          model: Auction,
          where: {
            status: { [Op.not]: ["pending", "killed"] },
          },
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
      order: [["id", "DESC"]],
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
  } catch (er) {
    return res.send(er);
  }
};

module.exports.getAllItems = async (req, res) => {
  const requestUser = req.currentUser;
  let { status, categories, tags, minBid, maxPrice, popularity } = req.query;
  let user = null;
  if (requestUser) {
    user = await User.findByPk(requestUser.id);
  }
  try {
    let whereClause = {};
    let orderClause = [];
    whereClause["isHidden"] = false;
    // Apply filters if provided
    let now = moment.tz("Asia/Amman").toDate();

    if (status && status !== "all") {
      if (status === "live") {
        whereClause["$Auction.startTime$"] = { [Op.lte]: now };
      } else if (status === "upcoming") {
        whereClause["$Auction.startTime$"] = { [Op.gt]: now };
      } else if (status === "hidden") {
        if (user.isAdmin === true) {
          whereClause["isHidden"] = true;
        } else {
          return res.send([]);
        }
      }
    }

    if (categories) {
      whereClause.categoryId = categories.split(",");
    }

    if (tags) {
      whereClause["$Tags.id$"] = tags.split(",");
    }

    if (minBid) {
      minBid = parseFloat(minBid);
      whereClause["$Auction.highestBid$"] = { [Op.gte]: minBid };
    }

    if (maxPrice) {
      maxPrice = parseFloat(maxPrice);
      whereClause["$Auction.highestBid$"] = { [Op.lt]: maxPrice };
    }

    if (popularity) {
      if (popularity === "high") {
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
    let nowUTC = moment.utc().toDate();
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
          where: {
            itemId: sequelize.col("Item.id"),
            finishTime: { [Op.gt]: now },
            status: { [Op.not]: ["pending", "killed"] },
          },
          attributes: [
            "startTime",
            "finishTime",
            "highestBid",
            "showNumber",
            "min_bid",
            "itemId",
            "status",
          ],
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

    if (requestUser) {
      await Promise.all(
        items.map(async (item) => {
          const interest = await Interest.findOne({
            where: {
              itemId: item.id,
              userId: requestUser.id,
            },
          });
          item.dataValues.isInterested = interest ? true : false;
        })
      );
    }

    return res.send(items);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.getAllItemsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1; // Parse the page parameter
    const limit = parseInt(req.query.limit) || 10; // Parse the limit parameter
    const offset = (page - 1) * limit; // Calculate the offset

    const items = await Item.findAll({
      where: { userId },
      include: [
        Category,
        {
          model: Tag,
          through: "Item_tag",
        },
        Image,
        {
          model: Auction,
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
      offset,
      limit,
      order: [["id", "DESC"]],
    });
    const count = await Item.count({ where: { userId } }); // find allandcount returned a wrong value due to associations or smth idk
    await Promise.all(
      items.map(async (item) => {
        const interest = await Interest.findOne({
          where: {
            itemId: item.id,
            userId: userId,
          },
        });
        item.dataValues.isInterested = interest ? true : false;
      })
    );

    return res.send({ count, items });
  } catch (err) {
    return res.send(err);
  }
};

module.exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const requestUser = req.currentUser;
    const t = await sequelize.transaction();
    if (!requestUser) {
      return res.status(401).send("Unauthorized");
    }
    const userId = requestUser.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    const images = await Image.findAll({
      where: {
        itemId: itemId,
      },
    });
    try {
      if (user.isAdmin == true) {
        await Item.destroy({ where: { id: itemId }, transaction: t });
      } else {
        await Item.destroy({
          where: { id: itemId, userId: userId },
          transaction: t,
        });
      }
    } catch (err) {
      return res.status(404).send("Item not found");
    }
    const deleteOps = images.map((image) =>
      cloudinary.uploader.destroy(image.imgURL.split("/").pop().split(".")[0])
    );
    await Promise.all(deleteOps);
    t.commit();
    return res.send("successfully");
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports.userHideItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.currentUser.id;

    await Item.update(
      { isHidden: true },
      {
        where: {
          id: itemId,
          userId: userId,
        },
      }
    );
    await Auction.update(
      { status: "user_hidden" },
      {
        where: {
          itemId: itemId,
        },
      }
    );
    return res.send("successfully");
  } catch (err) {
    return res.send(err);
  }
};

module.exports.adminHideItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    await Item.update(
      { isHidden: true },
      {
        where: {
          id: itemId,
        },
      }
    );
    await Auction.update(
      { status: "admin_hidden" },
      {
        where: {
          itemId: itemId,
        },
      }
    );
    return res.send("successfully");
  } catch (err) {
    return res.send(err);
  }
};

module.exports.reenlistItem = async (req, res) => {
  try {
    const requestUser = req.currentUser;

    if (!requestUser) {
      return res.status(401).send("Unauthorized");
    }

    let { itemId, startDate, endDate } = req.body;

    startDate = new Date(startDate);
    endDate = new Date(endDate);
    let now = moment.tz("Asia/Amman").toDate();

    if (startDate < now) {
      return res.status(400).send("Start date must be in the future");
    }
    if (endDate < startDate) {
      return res.status(400).send("End date must be after start date");
    }
    const user = await User.findByPk(requestUser.id);

    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    let item = null;
    if (user.isAdmin == true) {
      item = await Item.findOne({
        where: {
          id: itemId,
        },
        include: [
          {
            model: Auction,
            where: {
              itemId: itemId,
            },
          },
        ],
      });
    } else {
      item = await Item.findOne({
        where: {
          id: itemId,
          userId: requestUser.id,
        },
        include: [
          {
            model: Auction,
            where: {
              itemId: itemId,
            },
          },
        ],
      });
    }

    if (!item) {
      return res.status(404).send("Item not found");
    }
    if (!item.isHidden) {
      return res.status(400).send("Item is already enlisted bro!");
    }
    if (item.Auction.status == "admin_hidden" && user.isAdmin !== true) {
      return res
        .status(401)
        .send(
          "This item was hidden by and admin, please contact our support mazad.gp2@gmail.com to resolve this issue."
        );
    }

    await item.Auction.update(
      { status: "new", startTime: startDate, finishTime: endDate },
      {
        where: {
          itemId: itemId,
        },
      }
    );

    await item.update(
      { isHidden: false },
      {
        where: {
          id: itemId,
        },
      }
    );
    return res.send("successfully");
  } catch (err) {
    return res.send(err);
  }
};

module.exports.updateItem = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let itemId = req.params.id;
    const requestUser = req.currentUser;
    const userId = requestUser.id;
    let {
      name,
      description,
      startDate,
      endDate,
      tags,
      price,
      categoryId,
      showNumber,
      isHidden,
      oldImages,
      minBid,
    } = req.body;

    if (!requestUser) {
      return res.status(401).send("Unauthorized");
    }
    let user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    let item = null;
    if (user.isAdmin == true) {
      item = await Item.findOne({
        where: {
          id: itemId,
        },
        include: [
          User,
          Category,
          {
            model: Tag,
            through: "Item_tag",
          },
          {
            model: Comment,
            include: [User],
            order: [["id", "DESC"]],
          },
          Image,
          Auction,
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
      });
    } else {
      item = await Item.findOne({
        where: {
          id: itemId,
          userId: userId,
        },
        include: [
          User,
          Category,
          {
            model: Tag,
            through: "Item_tag",
          },
          {
            model: Comment,
            include: [User],
            order: [["id", "DESC"]],
          },
          Image,
          Auction,
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
      });
    }
    if (!item) {
      return res.status(404).send("Item not found");
    }
    tags = tags.split(",").filter((tag) => tag.trim() !== "");
    price = parseFloat(price);
    let now = moment.tz("Asia/Amman").toDate();
    if (item.Auction.finishTime < now) {
      return res
        .status(400)
        .send("This auction is finished, you cannot edit it anymore");
    }
    if (item.Auction.startTime < now) {
      return res
        .status(400)
        .send("This auction has already started, you cannot edit it anymore");
    }

    if (!name || !description || !startDate || !endDate || !tags || !price) {
      return res.status(400).send({ message: "All fields are required" });
    }
    if (name.length > 255) {
      return res.status(400).send("Name is too long");
    }
    if (name.length < 3) {
      return res.status(400).send("Name is too short");
    }
    if (new Date(startDate) < now) {
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
    if (typeof oldImages === "string" && oldImages !== "") {
      oldImages = [oldImages];
    } else if (oldImages === null || oldImages === undefined) {
      oldImages = [];
    } else {
      oldImages = oldImages.map((image) => parseInt(image));
    }
    let oldImagesCount = oldImages.length;
    if (images.length + oldImagesCount < 1) {
      return res.status(400).send("At least one image is required");
    }
    if (images.length + oldImagesCount > 10) {
      return res.status(400).send("Maximum 10 images allowed");
    }
    if (showNumber === null || showNumber === undefined) {
      showNumber = false;
    }

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

    await item.update(
      {
        name,
        description,
        userId,
        categoryId,
        isHidden,
      },
      { where: { id: req.params.id }, transaction: t }
    );

    await Auction.update(
      {
        startTime: startDate,
        finishTime: endDate,
        highestBid: price,
        showNumber: showNumber,
        min_bid: minBid,
      },
      { where: { itemId: req.params.id }, transaction: t }
    );

    // check if there are new images based on the names
    let itemImages = await Image.findAll({
      where: {
        itemId: item.id,
        id: { [Op.notIn]: oldImages },
      },
    });

    const deleteOps = itemImages.map((image) =>
      cloudinary.uploader.destroy(image.imgURL.split("/").pop().split(".")[0])
    );
    await Promise.all(deleteOps);

    if (images.length > 0) {
      const imageURLs = await Promise.all(
        images.map(async (image) => {
          const result = await cloudinary.uploader.upload(image.path);
          return result.url;
        })
      );

      await Image.bulkCreate(
        imageURLs.map((url) => ({
          imgURL: url,
          itemId: req.params.id,
        })),
        { transaction: t }
      );
    }

    const tagOps = tags.map((tag) =>
      Tag.findOrCreate({ where: { name: tag.trim() }, transaction: t })
    );

    const createdTags = await Promise.all(tagOps);

    // fk it, just delete all the tags and reinsert them 🤗
    await Item_tag.destroy({
      where: {
        itemId: req.params.id,
      },
      transaction: t,
    });

    await Item_tag.bulkCreate(
      createdTags.map((tag) => ({
        tagId: tag[0].id,
        itemId: req.params.id,
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

module.exports.toggleShowNumber = async (req, res) => {
  try {
    const itemId = req.params.id;

    const requestUser = req.currentUser;
    if (!requestUser) {
      return res.status(401).send("Unauthorized");
    }
    const user = await User.findByPk(requestUser.id);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    const item = await Item.findOne({
      where: {
        id: itemId,
      },
      include: [
        {
          model: Auction,
          where: {
            itemId: itemId,
          },
        },
      ],
    });
    if (!item) {
      return res.status(404).send("Item not found");
    }
    let isShowNumber = item.Auction.showNumber;
    if (item.Auction.endTime < now) {
      return res
        .status(400)
        .send("This auction is finished, you cannot edit it anymore");
    }
    await item.Auction.update(
      { showNumber: sequelize.literal("NOT showNumber") },
      {
        where: {
          itemId: itemId,
        },
      }
    );

    return res.send({ showNumber: !isShowNumber });
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports.searchItem = async (req, res) => {
  const search = req.query.search;
  const user = req.currentUser;
  try {
    const items = await Item.findAll({
      where: {
        isHidden: false,
        [Op.or]: [
          { name: { [Op.like]: "%" + search + "%" } },
          { "$Tags.name$": { [Op.like]: "%" + search + "%" } },
        ],
      },
      include: [
        {
          model: Auction,
          where: {
            status: { [Op.not]: ["pending", "killed"] },
          },
        },
        Category,
        Tag,
        Image,
      ],
      order: [["id", "DESC"]],
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
  } catch (err) {
    return res.status(400).send(err);
  }
};
