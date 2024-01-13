const mongoose = require("mongoose");
const URL = process.env.MONGODBURL;

mongoose
  .connect(`${URL}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connnection successfull to mongodb atlas");
  })
  .catch((e) => {
    console.log("no connection");
  });
