const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// router.use(verifyJWT)

router.route("/register").post(authController.createNewUser);
router.route("/login").post(authController.login);



module.exports = router;
