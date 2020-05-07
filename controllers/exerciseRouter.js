const User = require('../models/user.js');
const Workout = require('../models/workout.js');

const exerciseRouter = require("express").Router();

//**GET array of all users */

exerciseRouter.get('/users', (req, res, next) => {
    User.find({}, (err, data) => {
        if(err) next(err);
        res.json(data);
    })
});

//**POST new user */
//**************unique is not a valiator need to validate uniqueness of _id********//

exerciseRouter.post('/new-user', (req, res, next) => {
  const user = new User(req.body)
  console.log(user);
  user.save((err, data) => {
      if(err) return next(err);
      console.log("here");
      res.json({username: data.username, _id: data._id});
    })
});



//**POST new exercise */

exerciseRouter.post('/add', (req, res, next) => {
  console.log(req.body);
  User.findById({_id: req.body.userId}, (err, user) => {
    if(err) next(err);
    if(!user) return({message: "user ID not found"})
    const workout = new Workout(req.body);
    workout.username = user.username;
    workout.userId = user._id;
    if(!workout.date) workout.date = Date.now();
    workout.save((err, data) => {
    if(err) return next(err);
    res.json({
      username: data.username,
      description: data.description,
      duration: data.duration,
      _id: data.userID,
      date: data.date.toUTCString(),
      });
    })
  })  
});

//***GET full user log or part of user log */

//exerciseRouter.post('/log?')

//**ERROR MESSAGE */

exerciseRouter.use((err, req, res, next)=> {
    res.json({err: err.message});
});

module.exports = exerciseRouter;