const { Admin } = require("../app/models");
const mongoose = require("mongoose");
const config = require("../config")();
mongoose.connect(config.MONGO_DB.URI);

const {
  ADMIN: { EMAIL, PASSWORD }
} = config;
new Admin({
  password: PASSWORD,
  email: EMAIL
}).save(function(error) {
  console.log(
    `====Created The Admin User======\n> Password: ${PASSWORD}\n> Email: ${EMAIL}`
  );
  process.exit(0);
});
