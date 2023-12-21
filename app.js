const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const routes = require("./src/controller/controller.module");
const { csv_parser } = require("./src/util/csv/seed.subject");
//config constants
const PORT = process.env.PORT || 3000;
//init application
const app = express();
const corOption = {
  origin: "*",
  optionsSuccessStatus: 200,
};
//configure express
dotenv.config();
app.use(cors());
app.options(corOption, cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "./public")));
//routes
//app.use('/', routes);
require("./src/controller/controller.module")(app);
//start server
app.listen(PORT, () => {
  console.log(`APP IS LISTENING IN PORT ${PORT}`);
});
