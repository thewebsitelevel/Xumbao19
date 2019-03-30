const express = require("express");

const router = express.Router();

const adminLib = require("../../../lib/admin");
const { ERROR_TYPES } = require("../../../config/constants");
const logger = require("../../helper/logger");
const jwtHelper = require("../../helper/jwt");
const queryHelper = require("../../helper/query");
const { Admin } = require("../../models");

/**
 * createQuestion - create the question in the db
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
function createQuestion(req, res, next) {
  const questionObj = req.body;
  adminLib.createQuestion(questionObj, function(error, question) {
    if (error) {
      res.status(500).json({
        errorType: ERROR_TYPES.DB_ERROR,
        message: "Failed to create question.",
        details: error.message || error
      });
      logger.customLog("error", req, "Failed to create question.", {
        errorType: ERROR_TYPES.DB_ERROR,
        message: "Failed to create question.",
        details: error.message || error
      });
    } else {
      res.status(200).json({ question });
      logger.customLog("info", null, "Created Question", {});
    }
  });
}
/**
 * checkAdmin - check for admin
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {type} Description
 */
async function checkAdmin(req, res, next) {
  if ("authorization" in req.headers) {
    // get the bearer and token
    const [bearer, token] = req.headers["authorization"].split(" ");
    if (bearer === "Bearer") {
      if (token) {
        try {
          const payload = await jwtHelper.verify(token);
          const userDetials = await Admin.findById(payload.userId);
          if (userDetials) {
            req.user = userDetials;
            next();
          } else {
            res.status(401).json({
              errorDetails: "User Not Found",
              errorType: ERROR_TYPES.DB_ERROR,
              message: "Your not Authorization."
            });
          }
        } catch (error) {
          res.status(401).json({
            errorDetails: error.message || error,
            errorType: ERROR_TYPES.JWT_ERROR,
            message: "Your not Authorization."
          });
        }
      } else {
        res.status(401).json({
          errorDetails: "please add authentication header with token",
          errorType: ERROR_TYPES.JWT_ERROR,
          message: "Your not Authorization."
        });
      }
    } else {
      res.status(401).json({
        errorDetails: "please add authentication header with bearer",
        errorType: ERROR_TYPES.JWT_ERROR,
        message: "Your not Authorization."
      });
    }
  } else {
    res.status(401).json({
      errorDetails: "please add authentication header",
      errorType: ERROR_TYPES.JWT_ERROR,
      message: "Your not Authorization."
    });
  }
}
/**
 * createQuestion - get the answer
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
function getAnswers(req, res, next) {
  const {
    query: { q = "" }
  } = req;
  const { match = {}, limit = 10, skip = 0 } = queryHelper.parse_url(q);
  adminLib.getAnswers(match, limit, skip, function(errorInFetch, fetchedData) {
    if (errorInFetch) {
      res.status(500).json({
        errorType: ERROR_TYPES.DB_ERROR,
        message: "Failed to fetch answer",
        details: errorInFetch.message || errorInFetch
      });
      logger.customLog("error", req, "Failed to fetch answer", {
        errorType: ERROR_TYPES.DB_ERROR,
        message: "Failed to answer",
        details: errorInFetch.message || errorInFetch
      });
    } else {
      res.status(200).json(fetchedData);
      logger.customLog("info", null, "Feteched answer for admin.", {});
    }
  });
}

/**
 * getLogs - get the server logs
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
function getLogs(req, res, next) {
  try {
    const fileStream = adminLib.getLogs();
    fileStream.on("ready", () => {
      res.status(200).setHeader("Content-Type", "text/plain");
    });
    fileStream.on("end", () => {
      logger.customLog("info", "Sent the logs to admin.", {});
    });
    fileStream.on("error", error => {
      logger.customLog("error", "Failed to send the logs to admin", {
        errorType: ERROR_TYPES.FILE_STREAM_ERROR,
        message: "Failed fetch logs for the user.",
        details: error.message || error
      });
      res.status(500).json({
        errorType: ERROR_TYPES.FILE_STREAM_ERROR,
        message: "Failed fetch logs for the user.",
        details: error.message || error
      });
    });
    fileStream.pipe(res);
  } catch (error) {
    console.log(error);
  }
}
router.use(checkAdmin);
router.get("/getAnswers", getAnswers);
router.post("/createQuestion", createQuestion);
router.get("/logs", getLogs);
module.exports = router;
