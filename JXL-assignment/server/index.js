const express = require("express");
const routes = require("./routes/routes");
const cors = require("cors");
require("./db/connection");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;
const options = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(routes);

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
