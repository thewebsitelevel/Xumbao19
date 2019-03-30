const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question_title: {
      type: String,
      required: true
    },
    question_description: {
      type: String,
      required: true
    },
    question_image: {
      type: String
    },
    max_points: {
      type: Number,
      required: true
    },
    is_golden: {
      type: Boolean,
      defualt: false
    },
    golden_details: {
      start_time: {
        type: Date,
        defualt: Date
      },
      end_time: {
        type: Date,
        defualt: Date
      },
      question_details: {
        type: String,
        defualt: "It is Golden!"
      }
    },
    answers: {
      type: [
        {
          value: String,
          points: Number
        }
      ],
      required: true
    },
    negative: {
      type: Number,
      defualt: 1
    },
    attempts: {
      type: Number,
      defualt: 0
    },
    is_hint: {
      type: Boolean,
      required: true
    },
    hint: {
      type: String
    },
    level: {
      type: Number,
      required: true
    },
    salt: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
module.exports = questionSchema;
