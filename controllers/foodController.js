const { validationResult } = require("express-validator");
const HttpError = require("../models/http-errors");
const mongoose = require("mongoose");
const Cafe = require('../models/cafe');
const Food = require('../models/food');
const AdminUser = require("../models/adminUser")

const getFoodsByCafeId = async (req, res, next) => {

  let cafe;
  try {
    cafe = await Cafe.findById(req.params.pid).populate("menu");
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creatinng place failed, please try again",
      500
    );
    return next(error);
  }

  if (!cafe) {
    const error = new HttpError("can't getList of Menu, please try again");
    return next(error);
  }

  res.json({
    food: cafe.menu,
  });
};

const createFood = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { name, description, price } = req.body;

  let imageAddress = req.file?.path;


  let user;

  try {
    user = await AdminUser.findById(req.userData.userId).populate("cafe");
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creatinng place failed, please try again",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("create place failed , please try again");
    return next(error);
  }

  const createdFood = new Food({
    name,
    description,
    price,
    image: imageAddress?.replaceAll("\\", "/"),
    cafe: user.cafe,
  });

  // Create a session
  const session = await mongoose.startSession();
  // Start the transaction
  session.startTransaction();

  try {
    await createdFood.save({ session });
    user.cafe.menu.push(createdFood);
    await user.cafe.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    // Abort the transaction if an error occurs
    await session.abortTransaction();
    const error = new HttpError("Baking Food failed, please try again", 500);
    return next(error);
  } finally {
    // End the session
    session.endSession();
  }

  res.status(201).json({ food: createdFood });
};

// TODO UPDATE
const updateFood = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { name , price ,description} = req.body;
  const foodId = req.params.fid;
  let imageAddress = req.file?.path;

  let food;
  try {
    food = await Food.findById(foodId);
  } catch {
    const error = new HttpError(
      "Something went wrong, could not update food.",
      500
    );
    return next(error);
  }

  // if (place.owner.toString() !== req.userData.userId) {
  //   const error = new HttpError("You are not allowed to edit this place.", 401);
  //   return next(error);
  // }

  food.name = name;
  food.price = price;
  food.description = description;
  if (imageAddress) {
    food.image = imageAddress?.replaceAll("\\", "/");
  }

  try {
    await food.save();
  } catch {
    const error = new HttpError(
      "Something went wrong, could not update food.",
      500
    );
    return next(error);
  }

  res.status(200).json({ food: food.toObject({ getters: true }) });
};

// TODO DELETE
const deleteFood = async (req, res, next) => {
  const foodId = req.params.fid;

  let food;
  let cafe
  try {
    food = await Food.findById(foodId).populate("cafe");
  } catch {
    const error = new HttpError(
      "Something went wrong, could not delete food.",
      500
    );
    return next(error);
  }

  if (!food) {
    return next(new HttpError("Could not find food for this id"), 404);
  }

  // if (food.cafe.owner._id !== req.userData.userId) {
  //   console.log(cafe);
  //   console.log(food.cafe.owner , req.userData.userId);
  //   const error = new HttpError("You are not allowed to delete this food.", 403);
  //   return next(error);
  // }

  const session = await mongoose.startSession();
  try {
    //Create a session
    // Start the transaction
    session.startTransaction();
    await food.deleteOne({ session });
    food.cafe.menu.pull(food);
    await food.cafe.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    // Abort the transaction if an error occurs
    console.log(err);
    await session.abortTransaction();
    const error = new HttpError("deleting food failed, please try again", 500);
    return next(error);
  } finally {
    // End the session
    session.endSession();
  }

  res.status(200).json({ message: "Deleted food." });
};

exports.getFoodList = getFoodsByCafeId
exports.createFood = createFood
exports.deleteFood = deleteFood
exports.updateFood = updateFood
