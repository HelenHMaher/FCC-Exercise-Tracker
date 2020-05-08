

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Workout = new Schema({
  description: {
    type: String,
    required: true,
    maxlength: [100, "description cannot exceed 100 characters"],
  },
  duration: {
    type: Number,
    required: true,
    maxlength: [5, "duration cannot exceed 5 characters"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  username: String,
  userId: {
    type: String,
    ref: "User",
    index: true,
  },
});


module.exports = mongoose.model("Workout", Workout);
