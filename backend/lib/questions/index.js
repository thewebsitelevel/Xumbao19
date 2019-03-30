/**
 * @fileDescription the file contains all the custom datbase operations related to the
 * question and answers.
 * each function perform a task and passes the error or result to the callback
 * */

/**
 * Rules For Question
 * 1. Every time for every wrong answer there is - marks.
 * 2. Every time someone get right answer there is - marks.
 * 3. Every hint put the marks to 30.
 * 4. Every answer can give you a different points.
 * 5. No two person can have same points for the same question
 * 6. If the question is golden, it can be answered between start and end time
 * 7. mininum points are 30 or [-7 to -1]
 * 8. max points are [max_points]
 * 9. You can get less than [max_points]
 */

const { User, Question, UserQuestion, Answer } = require("../../app/models");
const mongoose = require("mongoose");
const hashHelper = require("../../app/helper/hash");

/**
 * getQuestions - Get all the user with user data added.
 *
 * @param {String|Buffer} userId   user id for which questions are to be fetched.
 * @param {Function} callback function envoked with error and database
 *                            1. error the error in aggregation
 *                            2. data the aggragated data if no error
 * @returns {type} Description
 */
async function getQuestions(userId, getGolden, callback) {
  const match = {};
  if (getGolden) {
    match["question_id.is_golden"] = true;
    match["question_id.golden_details.start_time"] = { $lte: new Date() };
    match["question_id.golden_details.end_time"] = { $gte: new Date() };
  }
  UserQuestion.aggregate([
    {
      $match: {
        user_id: mongoose.Types.ObjectId(userId),
        is_answered: false
      }
    },
    {
      $lookup: {
        from: "questions",
        localField: "question_id",
        foreignField: "_id",
        as: "question_id"
      }
    },
    {
      $match: {
        "question_id.is_golden": false,
        ...match
      }
    },
    {
      $sort: {
        level: 1
      }
    },
    {
      $limit: 1
    },
    {
      $project: {
        "question_id.answers": 0,
        "question_id.hint": 0,
        "question_id.salt": 0
      }
    },
    {
      $unwind: "$question_id"
    }
  ]).exec(function(errorInAggregate, aggregatedData) {
    if (errorInAggregate) {
      callback(errorInAggregate);
    } else {
      if (aggregatedData && aggregatedData.length > 0) {
        callback(null, aggregatedData[0]);
      } else {
        if (getGolden) {
          callback("No Golden Question.");
        } else {
          callback("No Question available");
        }
      }
    }
  });
}

/**
 * checkAnswer - check the answer and update the realted entity and the question are the updated for attempts and answers
 *
 * @param {String} answer     the anwer supplied by the user
 * @param {String|Buffer} userId     the user id of the user
 * @param {String|Buffer} questionId question for anser is answered
 * @param {Function} callback   the function is envoked with error and result
 *                              1. the error while performing the operation
 *                              2. the result may be true or false,
 *
 * @returns {undefined}
 */
async function checkAnswer(answer, userId, questionId, callback) {
  // fetch the question from db
  UserQuestion.aggregate([
    {
      $match: {
        user_id: mongoose.Types.ObjectId(userId),
        question_id: mongoose.Types.ObjectId(questionId)
      }
    },
    {
      $lookup: {
        from: "questions",
        localField: "question_id",
        foreignField: "_id",
        as: "question_id"
      }
    }
  ]).exec(async function(errorInFetch, fetchedQuestion) {
    if (errorInFetch) {
      callback(errorInFetch);
    } else {
      if (fetchedQuestion && fetchedQuestion.length > 0) {
        fetchedQuestion = fetchedQuestion[0];
        // get the index of answer if correct
        if (
          fetchedQuestion.question_id[0].is_golden &&
          fetchedQuestion.question_id[0].golden_details.end_time < Date.now() &&
          fetchedQuestion.question_id[0].golden_details.start_time < Date.now()
        ) {
          callback("You are Late.Try Next Time");
        } else {
          if (fetchedQuestion.is_answered) {
            callback("Question already answerd");
          } else {
            const originalAnswer = answer;
            answer = await hashHelper.createAnswerHash(
              answer.toLowerCase(),
              fetchedQuestion.question_id[0].salt
            );
            const index = fetchedQuestion.question_id[0].answers.findIndex(
              givenAnswer => givenAnswer.value === answer
            );
            // if answer is correct
            if (index > -1) {
              const correctAnswer =
                fetchedQuestion.question_id[0].answers[index];
              // points = max points - negative x attempts - answer_prirorty - global_attempts
              /**
               * points are calculated based on the following parametrs
               * question maximum points.
               * priority of the answer, higher the number lower the marks.
               * number of attempts by the user.
               * hint used or not.
               * number of correct answers to the question by other useers
               * minimum marks for any correct answers is 30
               */
              let points =
                fetchedQuestion.question_id[0].max_points -
                correctAnswer.points -
                fetchedQuestion.question_id[0].attempts -
                fetchedQuestion.attempts *
                  fetchedQuestion.question_id[0].negative;
              // min points=30
              if (points < 30) {
                points = 30;
              }
              // hint is uesd
              if (fetchedQuestion.hint_used) {
                points = 30;
              }
              // save the answer to the db
              const userAnswer = new Answer({
                user_id: userId,
                question_id: questionId,
                answer_value: originalAnswer,
                is_hint_used: fetchedQuestion.is_hint_used,
                is_correct: true,
                points
              });
              // update the user and question link
              await UserQuestion.update(
                { _id: fetchedQuestion._id },
                { points, is_answered: true }
              );
              await Question.update(
                { _id: fetchedQuestion.question_id[0]._id },
                { $inc: { attempts: 1 } }
              );
              await userAnswer.save();
              callback(null, true);
            } else {
              // update the user and question link
              await UserQuestion.update(
                { _id: fetchedQuestion._id },
                { $inc: { attempts: 1 } }
              );
              // save answer to the db
              const userAnswer = new Answer({
                user_id: userId,
                question_id: questionId,
                answer_value: originalAnswer,
                is_hint_used: fetchedQuestion.is_hint_used,
                is_correct: false,
                points: 0
              });
              await userAnswer.save();
              callback(null, false);
            }
          }
        }
      } else {
        callback({ message: "Question not found" });
      }
    }
  });
}

/**
 * getHintForQuestion - get the hint for the question
 *
 * @param {String|Buffer} userId     the id of the user
 * @param {String|Buffer} questionId the id of the question
 * @param {Function} callback   the function envoked with error and hint
 *
 * @returns {undefined}
 */
async function getHintForQuestion(userId, questionId, callback) {
  UserQuestion.aggregate([
    {
      $match: {
        user_id: mongoose.Types.ObjectId(userId),
        question_id: mongoose.Types.ObjectId(questionId)
      }
    },
    {
      $lookup: {
        from: "questions",
        localField: "question_id",
        foreignField: "_id",
        as: "question_id"
      }
    }
  ]).exec(async function(errorInFetch, fetchedQuestion) {
    if (errorInFetch) {
      callback(errorInFetch);
    } else {
      if (fetchedQuestion && fetchedQuestion.length > 0) {
        fetchedQuestion = fetchedQuestion[0];
        if (fetchedQuestion.is_hint) {
          await UserQuestion.update(
            { _id: fetchedQuestion._id },
            { hint_used: true, hint: fetchedQuestion.question_id[0].hint }
          );
          callback(null, fetchedQuestion.question_id[0].hint);
        } else {
          callback("Hint not available for this question.");
        }
      } else {
        callback({ message: "Question not found" });
      }
    }
  });
}

/**
 * getAnswers - get all the answers from the user
 *
 * @param {object}   [match={}]          the filter object
 * @param {number}   [limit=10]          the number of response
 * @param {number}   [skip=0]            the numer of response skipped
 * @param {function} [callback=() => {}] the function envoked with data and error
 *
 * @returns {undefined}
 */
async function getAnswers(
  match = {},
  limit = 10,
  skip = 0,
  callback = () => {}
) {
  skip = Number(skip);
  limit = Number(limit);
  Answer.aggregate([
    {
      $lookup: {
        from: "questions",
        localField: "question_id",
        foreignField: "_id",
        as: "question_id"
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
      $project: {
        "question_id.answers": 0,
        "question_id.hint": 0,
        answer_value: 0,
        "user_id.email": 0,
        "user_id.ffid": 0,
        "user_id.phone": 0,
        "user_id.hash": 0,
        "user_id.salt": 0,
        "user_id.access_token": 0
      }
    },
    {
      $match: match
    },
    {
      $unwind: "$user_id"
    },
    {
      $unwind: "$question_id"
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    }
  ]).exec(function(errorInFetch, fetchedData) {
    if (errorInFetch) {
      callback(errorInFetch);
    } else {
      callback(null, fetchedData);
    }
  });
}
module.exports = { getQuestions, getHintForQuestion, checkAnswer, getAnswers };
