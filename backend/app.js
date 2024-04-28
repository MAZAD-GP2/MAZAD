const express = require("express");
const cors = require("cors");
const router = require("./routes/allRoutes");
const relations = require("./models/Associations");
require("dotenv").config();
const app = express();

relations();
app.use(cors());
app.use(express.json());
app.use("/", router);

app.listen(process.env.PORT, () => {
  console.log(`app listenting to port ${process.env.PORT}`);
});
