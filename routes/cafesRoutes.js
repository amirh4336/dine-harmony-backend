const express = require('express');
const checkAuth = require("../middleware/check-auth")
const cafeControllers = require('../controllers/cafeControllers');
const router = express.Router()


router.get("/" ,  cafeControllers.getCafeList)

router.use(checkAuth)

router.post("/create" ,  cafeControllers.createCafe)


module.exports = router