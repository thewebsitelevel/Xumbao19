const winston = require("winston");
const CONFIG = require("../../config")();

const logger = new winston.createLogger({
  transports: [
    new winston.transports.File({
      level: "info",
      filename: `${__dirname}/../../logs/all-logs.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB -> 5242880
      maxFiles: 10, //10 files
      colorize: false
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: "debug",
      humanReadableUnhandledException: true,
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});
/**
 * Custom Logger method that appends log object with details
 * @param  {string} level   log level Possible values in order of priority
 *                          ( error > warn > info > verbose > debug > silly )
 * @param  {object} request request object (provides user information)
 * @param  {string} sMessage Main log message to be displayed
 * @param  {object} logObj  JSON object with defined log properties
 */
logger.customLog = function(level, reqObj, sMessage, logObj) {
  if (process.env.NODE_ENV === "test") {
    // Do not console log
    console.log("...log hidden...");
    return;
  }
  // set to empty object if empty or of a different type
  if (typeof logObj !== "object") {
    logObj = {};
  }
  logObj.logCategory = logObj.logCategory || "general";

  // add users email id if available in req
  if (reqObj && reqObj.user && reqObj.user.email) {
    logObj.user_email = reqObj.user.email;
  }

  logObj.message_details = sMessage;
  // add users email if available

  //TODO: Update logObj with user details
  logger.log(level, sMessage, logObj);
};

// handling uncaught exceptions
logger.emitErrs = true;
logger.on("error", function(err) {
  //logger.log('error', '---Unhandled exception ---', err);
});

/**
 * Logs the message for development debugging and error notifications ( in console only)
 * @param  {string} level   log level Possible values in order of priority
 *                          ( error > warn > info > verbose > debug > silly )
 * @param  {string} sMessage message to be logged
 * @param  {string} errorLocation method/file where error occured for easier identification
 */
logger.devLog = function(level, sMessage, errorLocation) {
  if (level === "error" || level === "warn") {
    console.log(` ${level}  !!! ${errorLocation} !!!  ${sMessage} \n`);
  } else {
    console.log(` ${level}  ::: ${errorLocation} :::  ${sMessage} \n`);
  }
};

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding) {
    logger.log("info", message.replace("\n", ""));
  }
};
