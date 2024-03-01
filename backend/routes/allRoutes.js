const express = require("express");
const router = express.Router();
const routes = require("./userRoutes");

router.route('/user').get(routes.getAllUsers);
router.route('/user/register').post(routes.register);
// router.route('/user/login').post(routes.login);

module.exports = router;
