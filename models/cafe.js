const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cafesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  phone: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  alreadyExistCapcity: {
    type: Number,
    required: true,
  },
  openClose: {
    type : Date,
    required: true
  }
  // TODO create reting and comment 
  // TODO create Food schema
  // Menu: {}

  // TODO create adminUser schema
  // owner: {

  // }
});

module.exports = mongoose.model("Cafe", cafesSchema);

