require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require('mongoose')

// middlewares
const { logger, logEvents } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");

// configs
const connectDB = require("./config/dbConnection");
const corsOptions = require("./config/corsOprions");

const app = express();
const PORT = process.env.PORT || 3500;

connectDB();

app.use(logger);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Resource Not Found" });
  } else {
    res.type("txt").send("404 Resource Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => {
    console.log(`Server start at port ${PORT}`);
  });
});

mongoose.connection.on('error', (err) => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
