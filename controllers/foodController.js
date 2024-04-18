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

  console.log(food);

  // if (place.owner.toString() !== req.userData.userId) {
  //   const error = new HttpError("You are not allowed to edit this place.", 401);
  //   return next(error);
  // }

  food.name = name;
  food.price = price;
  food.description = description;

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
  const placeId = req.params.pid;

  let place;
  try {
    place = await Cafe.findById(placeId).populate("owner");
  } catch {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  if (!place) {
    return next(new HttpError("Could not find place for this id"), 404);
  }

  if (place.owner.id !== req.userData.userId) {
    const error = new HttpError("You are not allowed to delete this place.", 403);
    return next(error);
  }

  const session = await mongoose.startSession();
  try {
    //Create a session
    // Start the transaction
    session.startTransaction();
    await place.deleteOne({ session });
    place.owner.cafe = null;
    await place.owner.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    // Abort the transaction if an error occurs
    console.log(err);
    await session.abortTransaction();
    const error = new HttpError("deleting place failed, please try again", 500);
    return next(error);
  } finally {
    // End the session
    session.endSession();
  }

  
  res.status(200).json({ message: "Deleted place." });
};

exports.getFoodList = getFoodsByCafeId
exports.createFood = createFood
exports.deleteFood = deleteFood
exports.updateFood = updateFood
