const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { customError } = require("../handlers/error/customError");
const { successCodes } = require("../handlers/success/successCodes");
const { errorCodes } = require("../handlers/error/errorCodes");
const { customSuccess } = require("../handlers/success/customSuccess");

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  // Confirm data
  if (!username || !password || !email) {
    throw new customError(errorCodes.INVALID_USER_DATA_ERROR);
  }

  // Minimum password length check
  if (password.length < 8) {
    throw new customError(errorCodes.INVALID_PASSWORD_LENGTH_ERROR);
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new customError(errorCodes.INVALID_EMAIL_FORMAT_ERROR);
  }

  // Username length and character validation
  if (username.length < 3 || !/^[a-zA-Z0-9]+$/.test(username)) {
    throw new customError(errorCodes.INVALID_USERNAME_FORMAT_ERROR);
  }

  // Check for duplicate email
  const duplicateEmail = await User.findOne({ email }).lean().exec();
  if (duplicateEmail) {
    throw new customError(errorCodes.DUPLICATE_EMAIL_ERROR);
  }

  // Check for duplicate username
  const duplicateUsername = await User.findOne({ username }).lean().exec();
  if (duplicateUsername) {
    throw new customError(errorCodes.DUPLICATE_USER_ERROR);
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject = { username, password: hashedPwd, email };

  // Create and store new user
  await User.create(userObject);

  const successResponse = new customSuccess(
    successCodes.USER_CREATED_SUCCESSFULLY
  );

  res.status(201).json(successResponse);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new customError(errorCodes.INVALID_USER_DATA_ERROR);
  }

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) {
    throw new customError(errorCodes.INVALID_USER_DATA_ERROR);
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) {
    throw new customError(errorCodes.INVALID_USER_DATA_ERROR);
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: foundUser.email,
        roles: foundUser.roles,
        _id: foundUser._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const successResponse = new customSuccess(
    successCodes.USER_LOGGED_IN_SUCCESSFULLY,
    { accessToken }
  );

  // Send accessToken containing username and roles
  res.json(successResponse);
});



module.exports = { createNewUser, login };
