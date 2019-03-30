const mongoose = require("mongoose");
const Question = require("./userQuestion");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name:{
    type:String,
    required:true,
  },
  image: {
    type: String,
    defualt: "N-A"
  },
  ffid: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  roll_number: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    defualt: 0
  },
  hash: {
    type: String
  },
  salt: {
    type: String
  },
  access_token: {
    type: String
  }
});

module.exports = userSchema;
