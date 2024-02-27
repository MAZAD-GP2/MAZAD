const express = require("express");
const cors = require("cors");
const database = require("./config/database");
const router = require("./routes/allRoutes");

const relations = require("./models/Associations");
relations();

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/', router);

app.listen(process.env.PORT,() => {
  console.log(`app listenting to port ${process.env.PORT}`);
});