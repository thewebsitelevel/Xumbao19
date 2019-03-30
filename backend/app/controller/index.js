const express = require("express");

const { ERROR_TYPES } = require("../../config/constants");
const jwtHelper = require("../helper/jwt");
const { User } = require("../models");

const appRoutes = require("./app");
const adminRoutes = require("./admin");
const homeRoutes = require("./home");
const leaderboardRoutes = require("./leadersboard");
const questionRoutes = require("./questions");
const userRoutes = require("./user");

const router = express.Router();

/**
 * authenticator - check for token and add user to req
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {undefined}
 */
async function authenticator(req, res, next) {
  if ("authorization" in req.headers) {
    // get the bearer and token
    const [bearer, token] = req.headers["authorization"].split(" ");
    if (bearer === "Bearer") {
      if (token) {
        try {
          const payload = await jwtHelper.verify(token);
          const userDetials = await User.findById(payload.userId);
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

router.use("/app", appRoutes);
router.use("/home", homeRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/leaderboard", authenticator, leaderboardRoutes);
router.use("/question", authenticator, questionRoutes);

module.exports = router;
