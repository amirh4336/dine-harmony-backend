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
  // TODO
  // image:{
  //   type: String,
  //   require: false
  // },
})



module.exports = mongoose.model("Cafe", foodSchema);