const checkAdmin = (req, res, next) => {
  try {
    if (!req.currentUser.isAdmin) {
      return res.status(400).send("you're not admin");
    }
    next();
  } catch (err) {
    return res.send(err);
  }
};

module.exports = checkAdmin;
