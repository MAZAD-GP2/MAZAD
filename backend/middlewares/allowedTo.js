const allowedTo = (req, res, next) => {
  try {
    if (!req.currentUser.isAdmin) {
      return res.status(400).send('gay gay go away');
    }
    next();
  } catch (err) {
    return res.send(err)
  }
};

module.exports = allowedTo;
