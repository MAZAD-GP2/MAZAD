const express = require("express");
const router = express.Router();
const routes = require("./userRoutes");

router.get("/user", routes.getAllUsers);

module.exports = router;
