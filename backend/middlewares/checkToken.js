const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    return res.send(err);
  }
};

module.exports = checkToken;
