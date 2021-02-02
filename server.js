const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require("path");
const cors = require('cors')
require("dotenv").config();


mongoose.connect("mongodb://localhost:27017/tapau", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const app = express();
app.use (cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const apiRouter = require("./src/routes");
app.use("/api/v1", apiRouter);
app.listen(3000, () => console.log("server started"))
