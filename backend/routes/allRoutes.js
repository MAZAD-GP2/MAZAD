const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const itemRoutes = require("./itemRoute");
const verifyToken = require("../middlewares/verfiytoken");
const allowedTo = require("../middlewares/allowedTo");

router.route("/user").get(verifyToken, allowedTo, userRoutes.getAllUsers)
router.route("/user/register").post(userRoutes.register);
router.route("/user/login").post(userRoutes.login);
router.route("/user/forgot-password").post(userRoutes.forgotPassword);
router.route("/user/reset-password").post(userRoutes.resetPassword);

router.route("/item/create").post(verifyToken, itemRoutes.createItem);
router.route('/item/user').get(verifyToken,itemRoutes.getAllItemsByUserId)
router.route('/item').get(itemRoutes.getAllItems)

module.exports = router;
