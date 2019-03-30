module.exports = {
  /**
   * parse_url - convert the base64 url object to json
   *
   * @param {string} query parse the string
   *
   * @returns {object} Description
   */
  parse_url(query) {
    if (typeof query === "string") {
      const utfString = Buffer.from(
        query.replace(/\-/g, "+").replace(/_/g, "/"),
        "base64"
      ).toString("utf8");
      try {
        return JSON.parse(utfString);
      } catch (error) {
        return {};
      }
    } else {
      return {};
    }
  }
};
