const express = require("express");

const questionLib = require("../../../lib/questions");
const { ERROR_TYPES } = require("../../../config/constants");
const logger = require("../../helper/logger");
const queryHelper = require("../../helper/query");

const router = express.Router();

/**
 * getQuestionDetials - Get the details of the question
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
function getQuestions(req, res, next) {
  const {
    query: { getGolden = false }
  } = req;
  questionLib.getQuestions(req.user._id, getGolden, function(
    errorInFetch,
    fetchedData
  ) {
    if (errorInFetch) {
      res.status(500).json({
        errorType: ERROR_TYPES.DB_ERROR,
        message: "Failed to fetch question",
        details: errorInFetch.message || errorInFetch
      });
      logger.customLog("error", req, "Failed to get the question", {
        errorType: ERROR_TYPES.DB_ERROR,
        message: "Failed to fetch question",
        details: errorInFetch.message || errorInFetch
      });
    } else {
      res.status(200).json(fetchedData);
      logger.customLog("info", null, "Feteched all the question", {
        userEmail: req.user.email
      });
    }
  });
}

/**
 * checkAnswer - check if the answer is correct or not
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
function checkAnswer(req, res, next) {
  questionLib.checkAnswer(
    req.body.answer,
    req.user._id,
    req.body.questionId,
    function(errorInFetch, fetchedData) {
      if (errorInFetch) {
        res.status(500).json({
          errorType: ERROR_TYPES.INCORRECT_PAYLOAD,
          message: "Failed to validate the answer",
          details: errorInFetch.message || errorInFetch
        });
        logger.customLog("error", req, "Failed to validate the answer", {
          errorType: ERROR_TYPES.DB_ERROR,
          message: "Failed to validate the answer",
          details: errorInFetch.message || errorInFetch
        });
      } else {
        res.status(200).json(fetchedData);
        logger.customLog("info", null, "Checked the answer for user", {
          userEmail: req.user.email
        });
      }
    }
  );
}
/**
 * getQuestionDetials - Get the details of the question
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
function getHintForQuestion(req, res, next) {
  const {
    query: { questionId }
  } = req;
  questionLib.getHintForQuestion(req.user._id, questionId, function(
    errorInFetch,
    fetchedData
  ) {
    if (errorInFetch) {
      res.status(500).json({
        errorType: ERROR_TYPES.DB_ERROR,
        message: "Failed to fetch question hint",
        details: errorInFetch.message || errorInFetch
      });
      logger.customLog("error", req, "Failed to get the question hint", {
        errorType: ERROR_TYPES.DB_ERROR,
        message: "Failed to fetch question hint",
        details: errorInFetch.message || errorInFetch
      });
    } else {
      res.status(200).json(fetchedData);
      logger.customLog("info", null, "Feteched all the question", {
        userEmail: req.user.email
      });
    }
  });
}
/**
 * getAnswers - get the answer
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
  questionLib.getAnswers(match, limit, skip, function(
    errorInFetch,
    fetchedData
  ) {
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
      logger.customLog("info", null, "Feteched answer for user.", {
        userEmail: req.user.email
      });
    }
  });
}

//routes for questions
router.get("/", getQuestions);
router.post("/checkAnswer", checkAnswer);
router.get("/getHintForQuestion", getHintForQuestion);
router.get("/getAnswers", getAnswers);
module.exports = router;
