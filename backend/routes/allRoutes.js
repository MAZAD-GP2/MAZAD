const express = require("express");
const router = express.Router();
const routes = require("./userRoutes");

router.route('/user').get(routes.getAllUsers);

module.exports = router;
