const mongoose = require("mongoose");
const env = require("../config/environment");
mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

db.on(
  "error",
  console.error.bind(console, "error in connecting to the database")
);
db.once("open", function () {
  console.log("connection with database is established");
});
