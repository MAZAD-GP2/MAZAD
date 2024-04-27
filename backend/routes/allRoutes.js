const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const itemRoutes = require("./itemRoute");
const categoryRoutes = require("./categoryRoutes");
const tagRoutes = require("./tagRoutes");
const authRoutes = require("./authRoutes");
const interestRoutes = require("./interestRoute");
const auctionRoutes = require("./auctionRoutes");
const bidRoutes = require("./bidRoutes");
const verifyToken = require("../middlewares/verifytoken");
const checkAdmin = require("../middlewares/checkAdmin");
const {
  validateUserCreation,
  validateUserUpdate,
  validatePasswordUpdate,
} = require("../utils/validators/userValidator");
const { validateItemCreation } = require("../utils/validators/itemValidator");
const multer = require("multer");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);  
  },
});
const upload = multer({ storage: storage }).array("images");
const uploadProfilePicture = multer({ storage: storage }).single("profilePicture");

// auth
router.route("/decode-token").post(authRoutes.decodeToken);

// user
router.route("/user").get(verifyToken(true), checkAdmin, userRoutes.getAllUsers);
router.route("/user/:id").get(userRoutes.getUserById);
router.route("/user/register").post(validateUserCreation, userRoutes.register);
router.route("/user/login").post(userRoutes.login);
router.route("/user/forgot-password").post(userRoutes.forgotPassword);
router.route("/user/reset-password").post(userRoutes.resetPassword);
router.route("/user/update").put(verifyToken(true), uploadProfilePicture, validateUserUpdate, userRoutes.updateUser);
router.route("/user/password-update").put(verifyToken(true), validatePasswordUpdate, userRoutes.passwordUpdate);
router.route("/user/delete/:id").delete(verifyToken(true), checkAdmin, userRoutes.deleteUser);

// item
router.route("/item").get(verifyToken(false), itemRoutes.getAllItems);
router.route("/item/user").get(verifyToken(true), itemRoutes.getAllItemsByUserId);
router.route("/item/favorites").get(verifyToken(true), itemRoutes.getAllItemsByFavorites);
router.route("/item/:id").get(verifyToken(false), itemRoutes.getItemById);
router.route("/item/create").post(upload, verifyToken(true), validateItemCreation, itemRoutes.createItem);
router.route("/item/category/:id").get(verifyToken(false), itemRoutes.getAllItemsByCategory);
router.route("/item/delete/:id").delete(verifyToken(true), checkAdmin, itemRoutes.deleteItem);

// Category
router.route("/category").get(categoryRoutes.getAllCategories);
router.route("/category/create").post(categoryRoutes.createCategory);
router.route("/category/update").put(categoryRoutes.updateCategory)

// Interest
router.route("/interest/add/:id").post(verifyToken(true), interestRoutes.updateInterests);
router.route("/interest/remove/:id").delete(verifyToken(true), interestRoutes.updateInterests);

// Auction
router.route("/auction/:id").get(auctionRoutes.getAuctionById);
router.route("/auction/user/:id").get(auctionRoutes.getAuctionsByUser);
router.route("/auction/create").post(verifyToken(true), auctionRoutes.addAuction);
router.route("/auction/update").put(verifyToken(true), auctionRoutes.updateAuction);
router.route("/auction/delete/:id").delete(verifyToken(true), auctionRoutes.removeAuction);

// Bid
router.route("/bid/:id").get(bidRoutes.getBidById);
router.route("/bid/auction/:id").get(bidRoutes.getBidsByAuction);
router.route("/bid/user/:id").get(bidRoutes.getBidsByUser);
router.route("/bid/create").post(verifyToken(true), bidRoutes.addBid);
router.route("/bid/delete/:id").delete(verifyToken(true), bidRoutes.removeBid);

// Search
router.route('/search').get(verifyToken(false), itemRoutes.searchItem);

// tag
router.route("/tag").get(tagRoutes.getAllTags);
router.route("/tag/search/:query").get(tagRoutes.searchTags);
router.route("/tag/create").post(tagRoutes.createTag);
router.route("/tag/delete/:id").delete(tagRoutes.deleteTag);

module.exports = router;
