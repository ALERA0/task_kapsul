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

  // Takip ettiği kişilerin postlarını bul
  const followingPosts = await Post.find({
    userId: { $in: followingUsers },
  })
    .populate("userId", "username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Takip ettiği kişilerin retweet ettiği postları bul
  const retweetedPosts = await Post.find({
    
      retweets: { $exists: true, $ne: [] } ,
    
  })
    .populate("userId", "username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    console.log(retweetedPosts)

  const allPosts = [...followingPosts, ...retweetedPosts];

  const sortedPosts = allPosts
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(skip, skip + limit);

  if (!sortedPosts || sortedPosts.length === 0) {
    throw new customError(errorCodes.POST_NOT_FOUND_ERROR);
  }

  const successResponse = new customSuccess(
    successCodes.POST_FETCHED_SUCCESSFULLY,
    {
      followingUsers: user.followings,
      posts: sortedPosts,
    }
  );

  res.json(successResponse);
});


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

const retweetPost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.postId;

  const post = await Post.findById(postId);
  if (!post) {
    throw new customError(errorCodes.POST_NOT_FOUND_ERROR);
  }

  // Kullanıcı daha önce retweet etmediyse ekle
  if (!post.retweets.includes(userId)) {
    post.retweets.push(userId);
    await post.save();
  } else {
    throw new customError(errorCodes.POST_ALREADY_RETWEETED_ERROR);
  }

  const successResponse = new customSuccess(
    successCodes.POST_RETWEET_SUCCESSFULLY,
    {
      post,
    }
  );
  res.json(successResponse);
});

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("userId", "username");
  if (!posts || posts.length === 0) {
    throw new customError(errorCodes.POST_NOT_FOUND_ERROR);
  }

  const successResponse = new customSuccess(
    successCodes.POST_FETCHED_SUCCESSFULLY,
    {
      posts,
    }
  );

  res.json(successResponse);
});
  

module.exports = { createPost, feed, likePost, unlikePost,retweetPost,getAllPosts };
