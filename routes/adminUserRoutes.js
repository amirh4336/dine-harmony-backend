const express = require("express");
const { check } = require("express-validator");
const adminUserControllers = require("../controllers/adminUserControllers");
const fileUpload = require("../middleware/file-upload")
const router = express.Router();

router.get("/users" ,  adminUserControllers.getUsers)

router.post("/signup",fileUpload.single("image"),
[
  check("fullName").not().isEmpty(),
  check("email").normalizeEmail().isEmail(),
  check("password").isLength({ min: 6 }),
], adminUserControllers.signup);

router.post("/login", adminUserControllers.login);

module.exports = router;
