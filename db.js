const mongoose = require("mongoose");

string = process.env.DATABASE;
mongoose
  .connect(string)
  .then((res) => {
    console.log("db connected  successfully");
  })
  .catch((err) => {
    console.log(err);
  });
