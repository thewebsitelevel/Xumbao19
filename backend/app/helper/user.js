const crypto = require("crypto");

module.exports = {
  /**
   * createPasswordHash - create hash and salt for password
   *
   * @param {String} password Description
   *
   * @returns {Promise} resolve with an object
   */
  createPasswordHash(password) {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(20, (error, salt) => {
        salt = salt.toString("hex");
        if (error) {
          reject(error);
        } else {
          try {
            const hash = crypto
              .createHmac("sha256", salt)
              .update(password)
              .digest("hex");
            resolve({ salt, hash });
          } catch (errorHashing) {
            reject(errorHashing);
          }
        }
      });
    });
  },

  /**
   * checkHashPassword - check the password for the user
   *
   * @param {String} password the password supplied by the user
   * @param {String} salt     the salt from the database
   * @param {String} hash     the hash from the database
   *
   * @returns {Promise} the resul of check
   */
  checkHashPassword(password, salt, hash) {
    return new Promise((resolve, reject) => {
      try {
        const hashFromPassword = crypto
          .createHmac("sha256", salt)
          .update(password)
          .digest("hex");
        if (hashFromPassword === hash) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (errorInCheck) {
        reject(errorInCheck);
      }
    });
  }
};
