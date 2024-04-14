const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cafesRoutes = require("./routes/cafesRoutes");

const app = express();

app.use(bodyParser.json());

app.use("api/cafes", cafesRoutes);

mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kamet.liara.cloud:30745/${process.env.DB_NAME}?authSource=admin&replicaSet=rs0&directConnection=true`
  )
  .then(() => {
    app.listen(5000);
    console.log("server started on port 5000");
  })
  .catch((err) => {
    console.log("we have module error :", err);
  });
