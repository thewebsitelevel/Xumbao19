const express = require("express");

const homeLib = require("../../../lib/home");
const { ERROR_TYPES } = require("../../../config/constants");
const logger = require("../../helper/logger");

const router = express.Router();

/**
 * getHomeStats - get the number of users and answers
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
function getHomeStats(req, res, next) {
  homeLib.getHomeStats(function(errorInAggregate, data) {
    if (errorInAggregate) {
      res.status(500).json({
        errorType: ERROR_TYPES.DB_ERROR,
        message: "Unable to fetch home stats.",
        errorDetails: error.message || error
      });
      logger.customLog("error", req, "Failed to fetch homepage stats", {
        errorLocation: "controller.home.getHomeStats",
        errorType: ERROR_TYPES.DB_ERROR,
        errorDetails: error.message || error
      });
    } else {
      res.status(200).json(data);
      logger.customLog("info", req, "Fetched the home page stats", {});
    }
  });
}

router.get("/stats", getHomeStats);
module.exports = router;
