const Interest = require("../models/Interest");

module.exports.updateInterests = async (req, res) => {
  const userId = req.currentUser.id;
  const itemId = req.params.id;

  try {
    const interest = await Interest.findOne({
      where: {
        userId,
        itemId,
      },
    });
    let isInteresting = null;
    if (interest) {
      await Interest.destroy({
        where: {
          userId,
          itemId,
        },
      });
      isInteresting = false;
    } else {
      await Interest.create({ userId, itemId });
      isInteresting = true;
    }

    return res.send({
      msg: "success",
      success: true,
      isInteresting: isInteresting,
    });
  } catch (err) {
    return res.send({
      success: false,
      err: err.message,
    });
  }
};
