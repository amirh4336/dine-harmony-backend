const express = require('express');
const checkAuth = require("../middleware/check-auth")
const foodController = require('../controllers/foodController');
const router = express.Router()


router.get("/:pid" ,  foodController.getFoodList)

router.use(checkAuth)

router.post("/create" ,  foodController.createFood)
router.patch("/:fid" ,  foodController.updateFood)

router.delete("/:fid", foodController.deleteFood);


module.exports = router