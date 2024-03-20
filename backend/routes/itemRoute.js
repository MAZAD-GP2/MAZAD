require("dotenv").config();
const Item = require("../models/Item");
const User = require("../models/User");
const Category=require("../models/Category")
const Tag=require("../models/Tag")

module.exports.createItem = async (req, res) => {
  //res.send(req.currentUser);
  try {
    const { name, description, categoryName} = req.body;
    let {tagNames}=req.body

    const userId = req.currentUser.id;

    const category = await Category.findOne({ where: { name: categoryName } });//checking if category exists
    const tags = await Promise.all(tagNames.map(tagName => Tag.findOrCreate({ where: { name: tagName } })));

    if (!category) {
      return res.status(404).send("Category not found");
    }
    const item = await Item.create({ name, description, categoryId: category.id, userId });
  /*  //console.log("AAAAAAAAAAAAAAAAAAAAAAAA",tagNames[0],tagNames[0].toString().length)
    tagNames=tagNames.filter((tag)=>{
      return tag.toString().trim().length!=0
    })
    //console.log(Object.keys(tagNames))
    tagNames=tagNames.filter((shit)=>
      shit.trim().length!=0
    )
    console.log(typeof(tagNames[0]))
    console.log(tagNames)
    if (tagNames && Array.isArray(tagNames) && tagNames.length > 0) {
      if(tagNames.length>3)
      tagNames=tagNames.slice(0,3)
      const tags = await Promise.all(tagNames.map(tagName => Tag.findOrCreate({ where: { name: tagName } })));

      await item.addTags(tags.map(([tag]) => tag));
    }
    //console.log(item)
*/    
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
    const {categoryId}=req.params
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).send("Category not found");
    }
    const items = await Item.findAll({
      where: { categoryId: category.id },
    });

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
