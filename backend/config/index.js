const DEV_CONFIG = require("./env_dev");
const LOCAL_CONFIG = require("./env_local");
const PRODUCTION_CONFIG = require("./env_prod");

module.exports = function() {
  switch (process.env.NODE_ENV) {
    case "local":
      return LOCAL_CONFIG;
    case "development":
      return DEV_CONFIG;
    case "prod":
    case "production":
      return PRODUCTION_CONFIG;
    default:
      return LOCAL_CONFIG;
  }
};
