const express = require('express');

const router = express.Router()


router.get("/" , (req , res , next) => {
  console.log("Get req to server");
  res.json({message: "It works!!"})
})


module.exports = router