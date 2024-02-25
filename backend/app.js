const express = require("express");
const cors = require("cors");
const database = require("./config/database");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT,() => {
  console.log(`app listenting to port ${process.env.PORT}`);
});
