const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    password: String,
    email: String
  },
  { timestamps: true }
);

module.exports = adminSchema;
