const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;


const adminUserSchema = new Schema({
  fullName: {
    type: String,
    reqiured: true,
  },
  certificateId: {
    type: String,
    reqiured: false,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: Number,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cafe: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Cafe",
  },
});

adminUserSchema.plugin(uniqueValidator)

module.exports = mongoose.model("AdminUser", adminUserSchema);
