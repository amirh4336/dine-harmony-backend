const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const foodSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: false
  },
  price: {
    type : String,
    require: true
  },
  image: {
    type: String,
  },
  cafe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cafe",
  }
  // TODO
  // image:{
  //   type: String,
  //   require: false
  // },
})



module.exports = mongoose.model("Food", foodSchema);