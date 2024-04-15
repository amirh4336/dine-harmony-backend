const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-errors");
const AdminUser = require("../models/adminUser");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await AdminUser.find({}, "-password");
  } catch {
    const error = new HttpError(
      "Fetching users failed , please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};
const signupAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { fullName , certificateId , phone, email, password } = req.body;

  let existsingUser;

  try {
    existsingUser = await AdminUser.findOne({ email });
  } catch {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existsingUser) {
    return next(
      new HttpError("User exists already, please login instead", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Could not create user, please try again", 500));
  }

  const createdUser = new AdminUser({
    fullName,
    certificateId,
    phone,
    email,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(`this is the error ${err}`);
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWR_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const loginAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs passed, please check your data", 422));
  }

  const { email, password } = req.body;

  let existsingUser;

  try {
    existsingUser = await AdminUser.findOne({ email });
  } catch {
    const error = new HttpError(
      "logging in failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!existsingUser) {
    return next(new HttpError("Invalid credntials, could not log you in", 403));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existsingUser.password);
  } catch (error) {
    next(
      new HttpError(
        "Could not log you in , please check your credentials and try again.",
        500
      )
    );
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid credntials, could not log you in", 403));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existsingUser.id, email: existsingUser.email },
      process.env.JWR_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("loggin in failed, please try again", 500);
    return next(error);
  }

  res.json({
    userId: existsingUser.id,
    email: existsingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signupAdmin;
exports.login = loginAdmin;
