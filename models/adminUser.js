const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;


const adminUsersSchema = new Schema({
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
  cafeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Cafe",
  },
});

adminUserSchema.plugin(uniqueValidator)

module.exports = mongoose.model("AdminUser", adminUsersSchema);
