const asyncHandler = require("express-async-handler");
const { errorCodes } = require("../handlers/error/errorCodes");
const { successCodes } = require("../handlers/success/successCodes");
const { customSuccess } = require("../handlers/success/customSuccess");
const { customError } = require("../handlers/error/customError");
const Post = require("../models/Post");
const User = require("../models/User");

const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;

  if (!content || content.trim() === "") {
    throw new customError(errorCodes.INVALID_INPUT_ERROR);
  }

  const MAX_CONTENT_LENGTH = 280;
  if (content.length > MAX_CONTENT_LENGTH) {
    throw new customError(errorCodes.INVALID_INPUT_LENGTH_ERROR);
  }

  const post = new Post({ userId, content });
  await post.save();

  const successResponse = new customSuccess(
    successCodes.POST_CREATED_SUCCESSFULLY,
    {
      post,
    }
  );

  res.json(successResponse);
});

const feed = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate("followings", "username");

  if (!user) {
    throw new customError(errorCodes.USER_NOT_FOUND_ERROR);
  }

  const followingUsers = user.followings;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Takip ettiği kullanıcıların postlarını bul
  const posts = await Post.find({
    userId: { $in: [...followingUsers, userId] },
  })
    .populate("userId", "username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if (!posts || posts.length === 0) {
    throw new customError(errorCodes.POST_NOT_FOUND_ERROR);
  }

  const successResponse = new customSuccess(
    successCodes.POST_FETCHED_SUCCESSFULLY,
    {
      followingUsers: user.followings,
      posts,
    }
  );

  res.json(successResponse);
});

// POST /likes - Bir paylaşımı beğenme
const likePost = asyncHandler(async (req, res) => {
  const { postId } = req.body;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    throw new customError(errorCodes.POST_NOT_FOUND_ERROR);
  }

  // Eğer kullanıcı daha önce bu postu beğenmediyse, beğeni ekleyin
  if (!post.likes.includes(userId)) {
    post.likes.push(userId);
    await post.save();
  } else {
    throw new customError(errorCodes.POST_ALREADY_LIKED_ERROR);
  }

  const successResponse = new customSuccess(
    successCodes.POST_LIKED_SUCCESSFULLY
  );

  res.json(successResponse);
});

// DELETE /likes - Bir paylaşımın beğenisini geri alma
const unlikePost = asyncHandler(async (req, res) => {
  const { postId } = req.body;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    throw new customError(errorCodes.POST_NOT_FOUND_ERROR);
  }

  // Eğer kullanıcı daha önce bu postu beğendi ise, beğeniyi geri alın
  const likeIndex = post.likes.indexOf(userId);
  if (likeIndex !== -1) {
    post.likes.splice(likeIndex, 1);
    await post.save();
  } else {
    throw new customError(errorCodes.POST_ALREADY_UNLIKED_ERROR);
  }

  const successResponse = new customSuccess(
    successCodes.POST_UNLIKED_SUCCESSFULLY
  );

  res.json(successResponse);
});

module.exports = { createPost, feed, likePost, unlikePost };
