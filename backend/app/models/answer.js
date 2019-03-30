const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    answer_value: {
      type: String,
      required: true
    },
    is_correct: {
      type: Boolean,
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    is_hint_used: {
      type: Boolean,
      defualt: false
    },
    points: {
      type: Number,
      defualt: 0
    }
  },
  { timestamps: true }
);

module.exports = answerSchema;
