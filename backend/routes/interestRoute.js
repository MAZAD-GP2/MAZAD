const Interest = require("../models/Interest");

// module.exports.addToInterests = async (req, res) => {
//   const userId = req.currentUser.id;
//   const itemId = req.params.id;

//   try {
//     await Interest.create({ userId, itemId });

//     return res.send("successfull");
//   } catch (err) {
//     return res.send({ err: err.message });
//   }
// };

// module.exports.removeFromInterests = async (req, res) => {
//   const userId = req.currentUser.id;
//   const itemId = req.params.id;

//   try {
//     await Interest.destroy({
//       where: {
//         userId,
//         itemId,
//       },
//     });

//     return res.send("successfull");
//   } catch (err) {
//     return res.send({ err: err.message });
//   }
// };

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
