const express = require("express");

const router = express.Router();

const adminLib = require("../../../lib/admin");
const { ERROR_TYPES } = require("../../../config/constants");
const logger = require("../../helper/logger");

/**
 * signin - The Signin the user and genearte token for the app
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
function signIn(req, res, next) {
  const passwordAndMail = req.body;
  adminLib.getAdminToken(passwordAndMail, function(error, token) {
    if (error) {
      res.status(401).json({
        errorType: ERROR_TYPES.DB_ERROR,
        message: "Invalid Email or Password",
        errorDetails: error.message || error
      });
      logger.customLog("error", req, "Failed to authenticate user", {
        errorLocation: "controller.user.signIn",
        errorType: ERROR_TYPES.DB_ERROR,
        errorDetails: error.message || error
      });
    } else {
      res.status(200).json({ token });
      logger.customLog("info", null, "Created token for the user", {
        userEmail: passwordAndMail.email
      });
    }
  });
}

router.post("/getAdminToken", signIn);
module.exports = router;
