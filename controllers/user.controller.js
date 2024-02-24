const asyncHandler = require("express-async-handler");

const User = require("../models/User");
const { errorCodes } = require("../handlers/error/errorCodes");
const { successCodes } = require("../handlers/success/successCodes");
const { customSuccess } = require("../handlers/success/customSuccess");
const { customError } = require("../handlers/error/customError");

const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get all users from MongoDB
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // If no users
  if (!users?.length) {
    throw new customError(errorCodes.USER_NOT_FOUND_ERROR);
  }

  const successResponse = new customSuccess(
    successCodes.USERS_FETCHED_SUCCESSFULLY,
    { users }
  );

  res.json(successResponse);
});

const followUser = asyncHandler(async (req, res) => {
  const { userIdToFollow } = req.body;
  const userId = req.user._id;

  if (userIdToFollow === userId) {
    throw new customError(errorCodes.USER_CANNOT_FOLLOW_ITSELF_ERROR);
  }

  const userToFollow = await User.findById(userIdToFollow);
  if (!userToFollow) {
    throw new customError(errorCodes.USER_NOT_FOUND_ERROR);
  }
  if (userToFollow.followers.includes(userId)) {
    throw new customError(errorCodes.USER_ALREADY_FOLLOWED_ERROR);
  }

  // Takip edilen kullanıcının "followers" listesine takip eden kullanıcının ID'sini ekle
  userToFollow.followers.push(userId);
  await userToFollow.save();

  // Takip eden kullanıcının "followings" listesine takip edilen kullanıcının ID'sini ekle
  const user = await User.findById(userId);
  user.followings.push(userIdToFollow);
  await user.save();

  const successResponse = new customSuccess(
    successCodes.USER_FOLLOWED_SUCCESSFULLY
  );

  res.json(successResponse);
});

const unfollowUser = asyncHandler(async (req, res) => {
  const { userIdToUnfollow } = req.body;
  const userId = req.user._id;

  if (userIdToUnfollow === userId) {
    throw new customError(errorCodes.USER_CANNOT_UNFOLLOW_ITSELF_ERROR);
  }

  const userToUnfollow = await User.findById(userIdToUnfollow);

  if (!userToUnfollow) {
    throw new customError(errorCodes.USER_NOT_FOUND_ERROR);
  }

  const followerIndex = userToUnfollow.followers.indexOf(userId);
  if (followerIndex === -1) {
    throw new customError(errorCodes.USER_NOT_FOLLOWING_ERROR);
  }

  // Takip edilen kullanıcının "followers" listesinden takip eden kullanıcının ID'sini çıkar
  userToUnfollow.followers.splice(followerIndex, 1);
  await userToUnfollow.save();

  // Takip eden kullanıcının "followings" listesinden takip edilen kullanıcının ID'sini çıkar
  const user = await User.findById(userId);
  const followingIndex = user.followings.indexOf(userIdToUnfollow);
  if (followingIndex !== -1) {
    user.followings.splice(followingIndex, 1);
    await user.save();
  }

  const successResponse = new customSuccess(
    successCodes.USER_UNFOLLOWED_SUCCESSFULLY
  );

  res.json(successResponse);
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username })
    .populate("followers", "username")
    .populate("followings", "username");

  if (!user) {
    throw new customError(errorCodes.USER_NOT_FOUND_ERROR);
  }

  const userProfile = {
    username: user.username,
    followersCount: user.followers.length,
    followingCount: user.followings.length,
  };

  const successResponse = new customSuccess(
    successCodes.USER_FETCHED_SUCCESSFULLY,
    {
      userProfile,
    }
  );

  res.json(successResponse);
});

module.exports = { getAllUsers, followUser, unfollowUser, getUserProfile };
