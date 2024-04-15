const { validationResult } = require("express-validator");
const HttpError = require("../models/http-errors");
const mongoose = require("mongoose");
const Cafe = require('../models/cafe');
const AdminUser = require("../models/adminUser")

const getCafes = async (req, res, next) => {

  console.log("test");

  let userWithPlaces;
  try {
    userWithPlaces = await Cafe.find()
    console.log(userWithPlaces);
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!userWithPlaces) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }

  res.json({
    places: userWithPlaces.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createCafe = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { name, description, address , phone , capacity } = req.body;


  const createdPlace = new Cafe({
    name,
    description,
    address,
    phone,
    capacity,
    owner: req.userData.userId,
  });


  let user;

  try {
    user = await AdminUser.findById(req.userData.userId);
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

  // Create a session
  const session = await mongoose.startSession();
  // Start the transaction
  session.startTransaction();

  try {
    await createdPlace.save({ session });
    user.cafeId(createdPlace);
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    // Abort the transaction if an error occurs
    await session.abortTransaction();
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  } finally {
    // End the session
    session.endSession();
  }

  res.status(201).json({ place: createdPlace });
};

const deleteCafe = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Cafe.findById(placeId);
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

  // if (place.creator.id !== req.userData.userId) {
  //   const error = new HttpError("You are not allowed to delete this place.", 403);
  //   return next(error);
  // }

  
  res.status(200).json({ message: "Deleted place." });
};

exports.getCafeList = getCafes
exports.createCafe = createCafe
