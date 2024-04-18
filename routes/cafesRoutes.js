const express = require("express");
const checkAuth = require("../middleware/check-auth");
const cafeControllers = require("../controllers/cafeControllers");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();

router.get("/", cafeControllers.getCafeList);

router.use(checkAuth);

router.post("/create", fileUpload.single("image"), cafeControllers.createCafe);
router.patch("/:pid" , fileUpload.single("image"), cafeControllers.updateCafe);

router.delete("/:pid", cafeControllers.deleteCafe);

module.exports = router;
