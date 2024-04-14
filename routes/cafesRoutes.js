const express = require('express');
const cafeControllers = require('../controllers/cafeControllers');
const router = express.Router()


router.get("/" ,  cafeControllers.getCafeList)


router.post("/create" ,  cafeControllers.createCafe)


module.exports = router