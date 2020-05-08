const User = require("../models/user.js");
const Workout = require("../models/workout.js");

const exerciseRouter = require("express").Router();

//**GET array of all users *//

exerciseRouter.get("/users", (req, res, next) => {
  User.find({}, (err, data) => {
    if (err) next(err);
    res.json(data);
  });
});

//**POST new user *//

exerciseRouter.post("/new-user", (req, res, next) => {
  const user = new User(req.body);
  console.log(user);
  user.save((err, data) => {
    if (err) {
      if (err.code == 11000) {
        err.message = "This username has been taken, please choose another.";
        return next(err);
      }
      return next(err);
    }
    res.json({ username: data.username, _id: data._id });
  });
});

//**POST new exercise *//

exerciseRouter.post("/add", (req, res, next) => {
  console.log(req.body);
  User.findById({ _id: req.body.userId }, (err, user) => {
    if (err) next(err);
    if (!user) {
      const err = new Error("Invalid ID: user not found");
      err.status = 404;
      return next(err);
    }
    const workout = new Workout(req.body);
    workout.username = user.username;
    workout.userId = user._id;
    if (!workout.date) workout.date = new Date(Date.now());
    workout.save((err, data) => {
      if (err) return next(err);
      const output = user.toObject();
      delete output.__v;
      output.description = data.description;
      output.duration = data.duration;
      output.date = data.date.toDateString();
      res.json(output);
    });
  });
});

//***GET full user log or part of user log */

exerciseRouter.get("/log", (req, res, next) => {
  console.log(req.query);
  const userId = req.query.userId;
  const startDate = new Date(req.query.from);
  const endDate = new Date(req.query.to);
  const limit = parseInt(req.query.limit);
  User.findById({ _id: userId }, (err, user) => {
    if (err) next(err);
    if (!user) {
      const err = new Error("Invalid ID: user not found");
      err.status = 404;
      return next(err);
    }
    console.log(user);
    Workout.find({
      userId: userId,
      date: {
        $gte: !isNaN(startDate) ? req.query.from : 0,
        $lte: !isNaN(endDate) ? req.query.to : Date.now(),
      },
    })
      .sort({ date: 1 })
      .limit(limit)
      .exec((err, workouts) => {
        if (err) return next(err);
        console.log(workouts);
        const workoutLog = user.toObject();
        delete workoutLog.__v;
        workoutLog.count = workouts.length;
        workoutLog.from = !isNaN(startDate)
          ? startDate.toDateString()
          : !workouts === []
          ? workouts[0].date.toDateString()
          : "---";
        workoutLog.to = !isNaN(endDate)
          ? endDate.toDateString()
          : !workouts === []
          ? workouts[workouts.length - 1].date.toDateString()
          : "---";
        workoutLog.log = workouts.map((workout) => {
          return {
            description: workout.description,
            duration: workout.duration,
            date: workout.date.toDateString(),
          };
        });
        res.json(workoutLog);
      });
  });
});

//**ERROR MESSAGE */

exerciseRouter.use((err, req, res, next) => {
  res.json({ err: err.message });
});

module.exports = exerciseRouter;
