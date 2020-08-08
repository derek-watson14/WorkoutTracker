const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

const PORT = process.env.PORT || 8080;

const db = require("./models");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/workouttracker",
  { useNewUrlParser: true }
);

const routes = require("./controllers/routes.js");

app.use(routes);

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
