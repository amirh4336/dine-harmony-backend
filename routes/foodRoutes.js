const express = require('express');
const checkAuth = require("../middleware/check-auth")
const foodController = require('../controllers/foodController');
const router = express.Router()



router.use(checkAuth)
router.get("/" ,  foodController.getFoods)

router.post("/create" ,  foodController.createFood)
router.patch("/:fid" ,  foodController.updateFood)

router.delete("/:fid", foodController.deleteFood);


module.exports = router