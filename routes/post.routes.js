const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT)

router.route("/createPost").post(postController.createPost);
router.route("/feed").get(postController.feed);
router.route("/likePost").post(postController.likePost);
router.route("/unlikePost").delete(postController.unlikePost);








module.exports = router;
