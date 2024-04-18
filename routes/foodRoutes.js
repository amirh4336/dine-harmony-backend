const express = require("express");
const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");
const foodController = require("../controllers/foodController");
const router = express.Router();

router.get("/:pid", foodController.getFoodList);

router.use(checkAuth);

router.post("/create" , fileUpload.single("image"), foodController.createFood);
router.patch("/:fid" , fileUpload.single("image"), foodController.updateFood);

router.delete("/:fid", foodController.deleteFood);

module.exports = router;
