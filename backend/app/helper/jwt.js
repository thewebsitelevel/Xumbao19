const jwt = require("jsonwebtoken");
const config = require("../../config")();

module.exports = {
  /**
   * sign - create a jwt from payload.
   *
   * @param {Object} payload  the payload send to the user
   * @param {Function} callback function envoked with two parameters
   *                        1. error the error in operation
   *                        2. token the signed payload
   * @returns {Promise}
   */
  sign(payload, callback) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { ...payload, exp: Date.now() + config.JWT.EXPIRATION_TIME },
        config.JWT.SECERET,
        { algorithm: config.JWT.ALGORITHM },
        function(errorInSign, token) {
          if (errorInSign) {
            if (callback) {
              callback(errorInSign.message);
              resolve(null);
            } else {
              reject(errorInSign.message);
            }
          } else {
            if (callback) {
              callback(null, token);
              resolve(null);
            } else {
              resolve(token);
            }
          }
        }
      );
    });
  },

  /**
   * verify - check the token signature.
   *
   * @param {String} token    the token for verification
   * @param {Function} callback function envoked on completion of the task with
   *                        1. error the error in verification
   *                        2. if verification is successfull the decoded data is passed.
   * @returns {Promise}
   */
  verify(token, callback) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.JWT.SECERET, function(
        errorInVerfication,
        decodedData
      ) {
        if (errorInVerfication) {
          if (callback) {
            callback(errorInVerfication.message);
            resolve(null);
          } else {
            reject(errorInVerfication.message);
          }
        } else {
          if (callback) {
            callback(null, decodedData);
            resolve(null);
          } else {
            resolve(decodedData);
          }
        }
      });
    });
  }
};
