const {
  User,
  Question,
  UserQuestion,
  Answer,
  Admin
} = require("../../app/models");

const mongoose = require("mongoose");
const path = require("path");
const Joi = require("joi");
const fs = require("fs");

const jwtHelper = require("../../app/helper/jwt");
const hashHelper = require("../../app/helper/hash");

const quesObjectSchema = Joi.object().keys({
  question_title: Joi.string().required("Title is Required"),
  question_description: Joi.string().required("Question Description is Required"),
  question_image: Joi.string().required("Question image is Required"),
  max_points: Joi.number().required("Max Points is Required"),
  answers: Joi.array()
    .items(
      Joi.object().keys({
        value: Joi.string().required("Anwser Value is Required"),
        points: Joi.number().required("Points is Required")
      })
    )
    .min(1,"Atleast One Answer Should Be Present")
    .required("Answers are Required"),
  negative: Joi.number()
    .required("Negative is required")
    .min(0,"Question cannot have neagative less than 0")
    .max(7,"Question cannot hav negative more than 7"),
  is_hint: Joi.boolean().required("Hint Present should is required"),
  hint: Joi.string().when("is_hint", {
    is: true,
    then: Joi.required("Hint is required"),
    otherwise: Joi.forbidden("Hint should not be present ")
  }),
  level: Joi.number().required("Level is Required"),
  is_golden: Joi.boolean().required("Question Type golden is Required"),
  golden_details: Joi.object()
    .keys({
      start_time: Joi.date()
        .min("now","Golden Question cannot start earlier than now")
        .required("Golden Question start is Required"),
      end_time: Joi.date().required("Golden Question End Is Required"),
      question_details: Joi.string().optional()
    })
    .when("is_golden", {
      is: true,
      then: Joi.required("Golden question Details are required"),
      otherwise: Joi.forbidden("Golden details Should not be Present")
    })
});

/**
 * createQuestion - create the function in the db
 *
 * @param {type} quesObject detials of the question
 * @param {type} callback   the function envoked with error and database
 *                          1 error the error while saving,
 *                          2 data the save object
 *
 */
async function createQuestion(quesObject, callback) {
  const { error, value } = Joi.validate(quesObject, quesObjectSchema);
  if (error) {
    callback(error);
  } else {
    try {
      const salt = await hashHelper.getQuestionSalt();
      quesObject.salt = salt;
      quesObject.attempts = 0;
      quesObject.answers = quesObject.answers.map(({ value, points }) => ({
        value: hashHelper.createAnswerHash(value.toLowerCase(), salt),
        points
      }));

      const newQuestion = new Question(quesObject);
      const fetchedUsers = await User.find({});
      const allUserOuestions = fetchedUsers.map(
        user =>
          new UserQuestion({
            user_id: user._id,
            question_id: newQuestion._id,
            attempts: 0,
            is_answered: false,
            hint_used: false,
            points: 0
          })
      );
      newQuestion.save();
      await UserQuestion.insertMany(allUserOuestions);
      newQuestion.answers = null;
      newQuestion.hint = null;
      callback(null, newQuestion);
    } catch (errorInSave) {
      callback(errorInSave);
    }
  }
}
const passwordAndMailSchema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  password: Joi.string()
    .min(8)
    .required()
});
/**
 * getUserToken - create a signin toke for the user
 *
 * @param {Object} passwordAndMail the password and email
 * @param {Function} callback        the function is envoked with error and token
 *                               1. error the error while creating access_token
 *                               2. token the signin token.
 * @returns {undefined}
 */
async function getAdminToken(passwordAndMail, callback) {
  const { error, value } = Joi.validate(passwordAndMail, passwordAndMailSchema);
  if (error) {
    callback(error);
  } else {
    const adminDetials = await Admin.findOne({ email: passwordAndMail.email });
    if (adminDetials) {
      const isMatch = adminDetials.password === passwordAndMail.password;
      if (isMatch) {
        try {
          const token = await jwtHelper.sign({
            userId: adminDetials._id
          });
          callback(null, token);
        } catch (errorInSign) {
          callback(errorInSign);
        }
      } else {
        callback("Email/Password does not match");
      }
    } else {
      callback("Email/Password does not match");
    }
  }
}

/**
 * getAnswers - get all the answers from the admin
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
      $match: match
    },
    {
      $project: {
        "question_id.answers": 0,
        "question_id.hint": 0,
        answer_value: 0
      }
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

/**
 * getLogs - send the logs to the admin
 *
 * @returns {Stream} the file stream
 */
function getLogs() {
  const logPath = path.resolve(`${__dirname}/../../logs/all-logs.log`);
  const fileStream = fs.createReadStream(logPath);
  return fileStream;
}
module.exports = { createQuestion, getAdminToken, getAnswers, getLogs };
