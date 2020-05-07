
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortid = require("shortid");

const User = new Schema({
  username: {
    type: String,
    required: true,
    maxlength: [20, "username cannot exceed 20 characters"]
  },
  _id: {
    type: String,
    required: true,
    unique: true,
    index: true,
    maxlength: [20, "user ID cannot exceed 10 characters"]
  },
});

module.exports = mongoose.model("User", User);
