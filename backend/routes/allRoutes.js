const express = require("express");
const router = express.Router();
const routes = require("./userRoutes");
const verifyToken = require("../middlewares/verfiytoken");
const allowedTo = require("../middlewares/allowedTo");

router.route("/user").get(verifyToken, allowedTo, routes.getAllUsers)
router.route("/user/register").post(routes.register);
router.route("/user/login").post(routes.login);
router.route("/user/forgot-password").post(routes.forgotPassword);
router.route("/user/reset-password").post(routes.resetPassword);

module.exports = router;
