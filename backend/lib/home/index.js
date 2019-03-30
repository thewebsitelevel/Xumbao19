/**
 * @fileDescription the file contains all the custom datbase operations related to the
 * homepage.
 * each function perform a task and passes the error or result to the callback
 * */

const { User, Question, UserQuestion, Answer } = require("../../app/models");
const mongoose = require("mongoose");

/**
 * getHomeStats - get the number of answers and users
 *
 * @param {function} callback the function envoked with error and data
 *
 */
async function getHomeStats(callback) {
  Answer.aggregate([
    {
      $group: {
        _id: "$user_id",
        answers: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: null,
        totalAnswers: { $sum: "$answers" },
        totalUsers: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0
      }
    }
  ]).exec(function(errorInAggregate, aggregatedData) {
    if (errorInAggregate) {
      callback(errorInAggregate);
    } else {
      if (aggregatedData && aggregatedData.length > 0) {
        callback(null, aggregatedData[0]);
      } else {
        const dummyData = {
          totalUsers: 0,
          totalAnswers: 0
        };
        callback(null, dummyData);
      }
    }
  });
}

module.exports = { getHomeStats };
