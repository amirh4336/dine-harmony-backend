const express = require("express")
const bodyParser = require("body-parser")

const cafesRoutes = require("./routes/cafesRoutes") 


const app = express()

app.use("api/cafes" , cafesRoutes)

app.listen(5000)