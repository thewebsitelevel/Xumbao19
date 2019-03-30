const crypto = require("crypto");
module.exports = {
  /**
   * createAnswerHash - Description
   *
   * @param {String} answer The answer to be hashed.
   * @param {type} salt   The key of the hash.
   *
   * @returns {String} the hashed answer
   */
  createAnswerHash(answer, salt) {
    return crypto
      .createHmac("sha256", salt)
      .update(answer)
      .digest("hex");
  },

  /**
   * getQuestionSalt - The salt for the hash
   *
   * @returns {Promise} resolves with salt
   */
  getQuestionSalt() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(5, (error, salt) => {
        if (error) {
          reject(error);
        } else {
          resolve(salt.toString("hex"));
        }
      });
    });
  }
};
