const express = require("express");

const leaderboardLib = require("../../../lib/leaderboard");
const { ERROR_TYPES } = require("../../../config/constants");
const logger = require("../../helper/logger");

const router = express.Router();

/**
 * getLeaderboardStatus - get the leader board status
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
function getLeaderboardStatus(req, res, next) {
  const {
    query: { limit = 10, skip = 0 }
  } = req;
  leaderboardLib.getLeaderboardStatus(limit, skip, function(
    errorInFetch,
    fetchedData
  ) {
    if (errorInFetch) {
      res.status(500).json({
        errorType: ERROR_TYPES.DB_ERROR,
        message: "Failed to fetch leaderboard stats",
        details: errorInFetch.message || errorInFetch
      });
      logger.customLog("error", req, "Failed to fetch leaderboard stats", {
        errorType: ERROR_TYPES.DB_ERROR,
        message: "Failed to fetch question",
        details: errorInFetch.message || errorInFetch
      });
    } else {
      res.status(200).json(fetchedData);
      logger.customLog("info", null, "Feteched all the leaderboard status", {
        userEmail: req.user.email
      });
    }
  });
}

router.get("/", getLeaderboardStatus);
module.exports = router;
