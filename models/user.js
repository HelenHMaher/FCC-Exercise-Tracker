const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortid = require("shortid");

const User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: [20, "username cannot exceed 20 characters"],
  },
  _id: {
    type: String,
    default: shortid,
  },
});

module.exports = mongoose.model("User", User);
