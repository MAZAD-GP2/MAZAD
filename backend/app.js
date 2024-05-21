const express = require("express");
const cors = require("cors");
const router = require("./routes/allRoutes");
const relations = require("./models/Associations");
require("dotenv").config();
const bodyParser = require('body-parser');
const app = express();


relations();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use("/", router);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.listen(process.env.PORT, () => {
  console.log(`app listenting to port ${process.env.PORT}`);
});
