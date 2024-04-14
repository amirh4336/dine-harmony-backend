const express = require('express');
const cafeControllers = require('../controllers/cafeControllers');
const router = express.Router()


router.get("/" ,  cafeControllers.getCafeList)


module.exports = router