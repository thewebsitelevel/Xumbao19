// all the models are in this file

const mongoose = require("mongoose");

const Answer = require("./answer");
const Question = require("./question");
const User = require("./user");
const UserQuestion = require("./userQuestion");
const AdminSchema = require("./admin");

module.exports = {
  Answer: mongoose.model("Answer", Answer),
  Question: mongoose.model("Question", Question),
  User: mongoose.model("User", User),
  UserQuestion: mongoose.model("UserQuestion", UserQuestion),
  Admin: mongoose.model("Admin", AdminSchema)
};
