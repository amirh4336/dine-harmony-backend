const { validationResult } = require("express-validator");
const HttpError = require("../models/http-errors");
const mongoose = require("mongoose");
const Cafe = require('../models/cafe');

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
    capacity
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Create place failed ,Please try agian later.", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

exports.getCafeList = getCafes
exports.createCafe = createCafe
