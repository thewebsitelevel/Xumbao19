/**
 * @fileDescription the file contains all the custom datbase operations related to the
 * leaderboard.
 * each function perform a task and passes the error or result to the callback
 * */

const { User, Question, UserQuestion, Answer } = require("../../app/models");
const mongoose = require("mongoose");

/**
 * getLeaderboardStatus - get the leaderboard stats from the server
 *
 * @param {number}   [limit=10]          limit the response
 * @param {number}   [skip=10]           skip the response
 * @param {function} [callback=() => {}] envoked with error and result
 *
 */
function getLeaderboardStatus(limit = 10, skip = 10, callback = () => {}) {
  skip = Number(skip) || 0;
  limit = Number(limit) || 10;
  UserQuestion.aggregate([
    {
      $lookup: {
        from: "questions",
        localField: "question_id",
        foreignField: "_id",
        as: "question_id"
      }
    },
    {
      $unwind: "$question_id"
    },
    {
      $project: {
        "question_id.answers": 0,
        "question_id.hint": 0,
        hint: 0,
        attempts: 0,
        hint_used: 0,
        "question_id.question_description": 0,
        "question_id.question_image": 0,
        "question_id.is_golden": 0,
        "question_id.negative": 0,
        "question_id.salt": 0
      }
    },
    {
      $group: {
        _id: "$user_id",
        points: { $sum: "$points" },
        user_id: { $first: "$user_id" },
        question_id: { $addToSet: "$question_id" }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_id"
      }
    },
    {
      $unwind: "$user_id"
    },
    {
      $project: {
        "user_id.salt": 0,
        "user_id.hash": 0,
        "user_id.phone": 0,
        "user_id.email": 0,
        "user.access_token": 0
      }
    },
    {
      $sort: {
        points: -1
      }
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    }
  ]).exec(function(errorInAggregate, aggregatedData) {
    if (errorInAggregate) {
      callback(errorInAggregate);
    } else {
      callback(null, aggregatedData);
    }
  });
}
module.exports = { getLeaderboardStatus };
