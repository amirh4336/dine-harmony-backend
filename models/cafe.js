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
  // maybe later
  // location: {
  //   lat: {
  //     type: Number,
  //     required: true,
  //   },
  //   lng: {
  //     type: Number,
  //     required: true,
  //   },
  // },
  phone: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  // alreadyExistCapcity: {
  //   type: Number,
  //   required: true,
  // },
  // openClose: {
  //   type : Date,
  //   required: true
  // },
  // image: {
  //   type: String,
  //   required: true
  // }
  // TODO create Google rating
  // TODO create reting and comment 


  menu: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Food",
    },
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "AdminUser",
  }
});

module.exports = mongoose.model("Cafe", cafesSchema);

