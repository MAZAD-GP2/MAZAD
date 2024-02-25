const User = require("../models/user");

module.exports.getAllUsers = async (req, res) => {
  await User.findAll()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
};
