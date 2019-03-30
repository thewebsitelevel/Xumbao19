const mongoose = require("mongoose");

const userOuestionSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  attempts: {
    type: Number,
    defualt: 0
  },
  hint_used: {
    type: Boolean,
    defualt: false
  },
  points: {
    type: Number,
    defualt: 0
  },
  is_answered: {
    type: Boolean,
    defualt: false
  },
  hint: {
    type: String
  }
});

module.exports = userOuestionSchema;
