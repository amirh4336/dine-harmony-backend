const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  fullName: {
    type: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
});


module.exports = mongoose.model("User", usersSchema);
