const Interest = require("../models/Interest");

module.exports.addToInterests = async (req, res) => {
  const userId = req.currentUser.id;
  const itemId = req.params.id;

  try {
    await Interest.create({ userId, itemId });

    return res.send("successfull");
  } catch (err) {
    return res.send({ err: err.message });
  }
};

module.exports.removeFromInterests = async (req, res) => {
  const userId = req.currentUser.id;
  const itemId = req.params.id;

  try {
    await Interest.destroy({
      where: {
        userId,
        itemId,
      },
    });

    return res.send("successfull");
  } catch (err) {
    return res.send({ err: err.message });
  }
};
