const checkAdmin = (req, res, next) => {
  try {
    if (!req.currentUser.isAdmin) {
      throw new Error("Unauthorized 401");
    }
    next();
  } catch (err) {
    return res.send(err);
  }
};

module.exports = checkAdmin;
