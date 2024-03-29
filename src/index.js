const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT ?? 3000;

require("dotenv").config();

const { sync } = require("./models");
const apiRouter = require("./routes");
const cookieParser = require("cookie-parser");
const ErrorMiddleware = require("./middlewares/error.middleware");

app.use(cors({ origin: process.env.ORIGIN.split(' ') ?? "*"}));

app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use("/", apiRouter);
app.use(ErrorMiddleware);

sync()
  .then(() => {
    console.log("Connected to DB, models have been synchronized!");
    app.listen(port, async() => {
      console.log("App started on port " + port);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });