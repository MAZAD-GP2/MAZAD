const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const itemRoutes = require("./itemRoute");
const categoryRoutes = require("./categoryRoutes");
const authRoutes = require("./authRoutes");
const verifyToken = require("../middlewares/verfiytoken");
const checkAdmin = require("../middlewares/checkAdmin");
const {
  validateUserCreation,
  validateUserUpdate,
} = require("../utils/validators/userValidator");
const { validateItemCreation } = require("../utils/validators/itemValidator");
// auth
router.route("/decode-token").post(authRoutes.decodeToken);
// user
router.route("/user").get(verifyToken, checkAdmin, userRoutes.getAllUsers);
router.route("/user/register").post(validateUserCreation, userRoutes.register);
router.route("/user/login").post(userRoutes.login);
router.route("/user/forgot-password").post(userRoutes.forgotPassword);
router.route("/user/reset-password").post(userRoutes.resetPassword);
router
  .route("/user/update")
  .put(verifyToken, validateUserUpdate, userRoutes.updateUser);
router
  .route("/user/delete/:id")
  .delete(verifyToken, checkAdmin, userRoutes.deleteUser);
// item
router
  .route("/item/create")
  .post(verifyToken, validateItemCreation, itemRoutes.createItem);
router.route("/item/user").get(verifyToken, itemRoutes.getAllItemsByUserId);
router.route("/item").get(itemRoutes.getAllItems);

router.route("/category").get(categoryRoutes.getAllCategories);
router.route("/category/create").post(categoryRoutes.createCategory);

module.exports = router;
