const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT)

router.route("/allUsers").get(userController.getAllUsers);
router.route("/followUser").post(userController.followUser);
router.route("/unfollowUser").delete(userController.unfollowUser);
router.route("/getUserProfile/:username").get(userController.getUserProfile);






module.exports = router;
