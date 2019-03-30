const express = require("express");
const mongoose = require("mongoose");
const app = express();
const routes = require("./app/controller");
const config = require("./config")();
const { ERROR_TYPES } = require("./config/constants");
const morgan = require("morgan");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const logger = require("./app/helper/logger");
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(morgan("combined", { stream: logger.stream }));
mongoose.connect(
  config.MONGO_DB.URI,
  { useNewUrlParser: true },
  error => {
    if (error)
      logger.customLog("error", null, "error connecting to the mongodb", {
        errorLocation: "index.js"
      });
    else logger.customLog("info", null, "mongodb connected");
  }
);

app.use(cors());

app.use("/api", routes);
app.use(function(error, req, res, next) {
  res.status(500).json({
    errorDetails: error.message || error,
    errorType: ERROR_TYPES.UNHANDLED_ERROR,
    message: "Error while processing your Request."
  });
});

app.get('*',function(req,res,next){
 res.sendFile(`${__dirname}/public/index.html`);
})
const server = http.createServer(app);
server.listen(config.PORT, () => {
  console.log(`listening on port ${config.PORT}`);
});
