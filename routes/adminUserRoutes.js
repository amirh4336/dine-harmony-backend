const express = require("express");
const adminUserControllers = require("../controllers/adminUserControllers");
const router = express.Router();

router.get("/users" ,  adminUserControllers.getUsers)

router.post("/signup", adminUserControllers.signup);

module.exports = router;
