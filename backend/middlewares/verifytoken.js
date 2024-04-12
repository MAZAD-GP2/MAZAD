const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (userToken) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    try {
      if (!authHeader) {
        if (userToken) {
          throw new Error("Authorization failed");
        } else {
          return next();
        }
      }

      const token = authHeader.split(" ")[1];

      const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.currentUser = currentUser;
      return next();
    } catch (err) {
      return res.send(err);
    }
  };
};
