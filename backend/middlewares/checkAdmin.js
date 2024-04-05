const checkAdmin = (req, res, next) => {
  try {
    if (!req.currentUser.isAdmin) {
      throw new Error("you're not admin");
    }
    next();
  } catch (err) {
    return res.send(err);
  }
};

module.exports = checkAdmin;
