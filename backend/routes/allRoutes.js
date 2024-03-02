const express = require("express");
const router = express.Router();
const routes = require("./userRoutes");
const verifyToken = require("../middlewares/verfiytoken");
const allowedTo = require("../middlewares/allowedTo");

router.route("/user").get(verifyToken, allowedTo, routes.getAllUsers)
router.route("/user/register").post(routes.register);
router.route("/user/login").post(routes.login);

module.exports = router;
