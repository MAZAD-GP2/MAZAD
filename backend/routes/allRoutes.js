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
const commentRoutes = require("./commentRoutes");
const chatRoutes = require("./chatRoutes.js");
const verifyToken = require("../middlewares/verifytoken");
const checkAdmin = require("../middlewares/checkAdmin");
const multer = require("multer");
const {
  validateUserCreation,
  validateUserUpdate,
  validatePasswordUpdate,
} = require("../utils/validators/userValidator");
const { validateItemCreation } = require("../utils/validators/itemValidator");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } }).array("images");
const uploadProfilePicture = multer({ storage: storage }).single(
  "profilePicture"
);
const uploadUpdate = multer({ storage: storage }).array("images");

// auth
router.route("/decode-token").post(authRoutes.decodeToken);

// user
router
  .route("/user")
  .get(verifyToken(true), checkAdmin, userRoutes.getAllUsers);
router.route("/user/:id").get(userRoutes.getUserById);
router.route("/user/register").post(validateUserCreation, userRoutes.register);
router.route("/user/login").post(userRoutes.login);
router.route("/user/forgot-password").post(userRoutes.forgotPassword);
router.route("/user/reset-password").post(userRoutes.resetPassword);
router
  .route("/user/update")
  .put(
    verifyToken(true),
    uploadProfilePicture,
    validateUserUpdate,
    userRoutes.updateUser
  );
router
  .route("/user/password-update")
  .put(verifyToken(true), validatePasswordUpdate, userRoutes.passwordUpdate);
router
  .route("/user/delete/:id")
  .delete(verifyToken(true), checkAdmin, userRoutes.deleteUser);

router.route("/user/stats/:id").get(verifyToken(true), userRoutes.getUserStats);
router
  .route("/user/getBidHistory/:id")
  .get(verifyToken(true), userRoutes.getBidHistory);

  router
  .route("/users/getUnpaidAuctions")
  .get(verifyToken(true), userRoutes.getUnpaidAuctions);

// item
router.route("/item").get(verifyToken(false), itemRoutes.getAllItems);
router
  .route("/item/user/:id")
  .get(verifyToken(true), itemRoutes.getAllItemsByUserId);
router
  .route("/item/favorites")
  .get(verifyToken(true), itemRoutes.getAllItemsByFavorites);
router.route("/item/:id").get(verifyToken(false), itemRoutes.getItemById);
router
  .route("/item/create")
  .post(upload, verifyToken(true), validateItemCreation, itemRoutes.createItem);
router
  .route("/item/category/:id")
  .get(verifyToken(false), itemRoutes.getAllItemsByCategory);
router
  .route("/item/toggle-number/:id")
  .post(verifyToken(true), itemRoutes.toggleShowNumber);
router
  .route("/item/update/:id")
  .post(uploadUpdate, verifyToken(true), itemRoutes.updateItem);
router
  .route("/item/delete/:id")
  .delete(verifyToken(true), itemRoutes.deleteItem);
router
  .route("/item/hide/:id")
  .delete(verifyToken(true), itemRoutes.userHideItem);
router
  .route("/item/admin-hide/:id")
  .delete(verifyToken(true), checkAdmin, itemRoutes.adminHideItem);
router.route("/item/reenlist").post(verifyToken(true), itemRoutes.reenlistItem);
// Category
router.route("/category").get(categoryRoutes.getAllCategories);
router.route("/category/create").post(categoryRoutes.createCategory);
router.route("/category/update").put(categoryRoutes.updateCategory);

// Interest
router
  .route("/interest/add/:id")
  .post(verifyToken(true), interestRoutes.updateInterests);
router
  .route("/interest/remove/:id")
  .delete(verifyToken(true), interestRoutes.updateInterests);

// Auction
router.route("/auction/:id").get(auctionRoutes.getAuctionById);
router.route("/auction/user/:id").get(auctionRoutes.getAuctionsByUser);
router
  .route("/auction/user/:id/count")
  .get(auctionRoutes.getAuctionCountByUser);
router.route("/auction/item/:id").get(auctionRoutes.getAuctionsByItem);
router
  .route("/auction/create")
  .post(verifyToken(true), auctionRoutes.addAuction);
router
  .route("/auction/update")
  .put(verifyToken(true), auctionRoutes.updateAuction);
router
  .route("/auction/delete/:id")
  .delete(verifyToken(true), auctionRoutes.removeAuction);

// Bid
router.route("/bid/:id").get(bidRoutes.getBidById);
router.route("/bid/auction/:id").get(bidRoutes.getBidsByAuction);
router.route("/bid/user/:id").get(bidRoutes.getBidsByUser);
router.route("/bid/user/:id/count").get(bidRoutes.getBidsCountByUser);
router.route("/bid/create").post(verifyToken(true), bidRoutes.addBid);
router.route("/bid/delete/:id").delete(verifyToken(true), bidRoutes.removeBid);

// Search
router.route("/search").get(verifyToken(false), itemRoutes.searchItem);

// tag
router.route("/tag").get(tagRoutes.getAllTags);
router.route("/tag/search/:query").get(tagRoutes.searchTags);
router.route("/tag/create").post(tagRoutes.createTag);
router.route("/tag/delete/:id").delete(tagRoutes.deleteTag);

router.route("/comment/add").post(verifyToken(true), commentRoutes.addComment);

router
  .route("/chat/getRooms/:id")
  .get(verifyToken(true), chatRoutes.getChatRooms);
router
  .route("/chat/getRoomByUser/:id")
  .get(verifyToken(true), chatRoutes.getRoomByUser);
router
  .route("/chat/getMessagesInRoom/:roomId")
  .get(verifyToken(true), chatRoutes.getMessagesInRoom);
router
  .route("/chat/getRoomById/:roomId")
  .get(verifyToken(true), chatRoutes.getRoomById);
// router.route("/chat/createRoom").post(verifyToken(true), chatRoutes.createRoom);
router
  .route("/chat/sendMessage")
  .post(verifyToken(true), chatRoutes.sendMessage);
module.exports = router;
