const { validationResult } = require("express-validator");
const HttpError = require("../models/http-errors");
const mongoose = require("mongoose");
const cafe = require('../models/cafe');

const getCafes = async (req, res, next) => {

  let userWithPlaces;
  try {
    userWithPlaces = await cafe.collection.find()
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
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

exports.getCafeList = getCafes
