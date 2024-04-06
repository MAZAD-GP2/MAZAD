const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const itemRoutes = require("./itemRoute");
const categoryRoutes = require("./categoryRoutes");
const authRoutes = require("./authRoutes");
const interestRoutes = require("./interestRoute");
const verifyToken = require("../middlewares/verfiytoken");
const checkAdmin = require("../middlewares/checkAdmin");
const {
  validateUserCreation,
  validateUserUpdate,
  validatePasswordUpdate,
} = require("../utils/validators/userValidator");
const { validateItemCreation } = require("../utils/validators/itemValidator");
const multer = require("multer");
const checkToken = require("../middlewares/checkToken");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage }).array("images");

// auth
router.route("/decode-token").post(authRoutes.decodeToken);

// user
router.route("/user").get(verifyToken, checkAdmin, userRoutes.getAllUsers);
router.route("/user/:id").get(userRoutes.getUserById);
router.route("/user/register").post(validateUserCreation, userRoutes.register);
router.route("/user/login").post(userRoutes.login);
router.route("/user/forgot-password").post(userRoutes.forgotPassword);
router.route("/user/reset-password").post(userRoutes.resetPassword);
router.route("/user/update").put(verifyToken, validateUserUpdate, userRoutes.updateUser);
router.route("/user/password-update").put(verifyToken, validatePasswordUpdate, userRoutes.passwordUpdate);
router.route("/user/delete/:id").delete(verifyToken, checkAdmin, userRoutes.deleteUser);

// item
router.route("/item").get(checkToken, itemRoutes.getAllItems);
router.route("/item/user").get(verifyToken, itemRoutes.getAllItemsByUserId);
router.route("/item/:id").get(checkToken, itemRoutes.getItemById);
router.route("/item/create").post(upload, verifyToken, validateItemCreation, itemRoutes.createItem);
router.route("/item/category/:id").get(checkToken, itemRoutes.getAllItemsByCategory);
router.route("/item/delete/:id").delete(verifyToken, checkAdmin, itemRoutes.deleteItem);

// Category
router.route("/category").get(categoryRoutes.getAllCategories);
router.route("/category/create").post(categoryRoutes.createCategory);

router.route("/interest/add/:id").post(verifyToken, interestRoutes.addToInterests);
router.route("/interest/remove/:id").delete(verifyToken, interestRoutes.removeFromInterests);

module.exports = router;
