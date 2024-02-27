const express = require("express");
const cors = require("cors");
const database = require("./config/database");
const router = require("./routes/allRoutes");
const Category = require("./models/Category");
const Comment = require("./models/Comment");
const Message = require("./models/Message");


require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/', router);

app.listen(process.env.PORT,() => {
  console.log(`app listenting to port ${process.env.PORT}`);
});