const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/jxl-assignment-payal-singh", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to database!");
  })
  .catch((err) => {
    console.log(err);
  });
