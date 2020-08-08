const express = require("express");
const router = express.Router();
const db = require("../models");
const moment = require("moment");

// ! Exercise routes
// Add exercise to workout
router.post("/api/exercise/:workoutid", (req, res) => {
  db.Exercise.create(req.body)
    .then((data) => {
      return db.Workout.findOneAndUpdate(
        { _id: req.params.workoutid },
        { $push: { exercises: data._id } }
      );
    })
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((err) => res.status(500).json(err).end());
});

// ! Workout routes
// Get most recent 5 workouts
router.get("/api/workout", (req, res) => {
  db.Workout.find({})
    .sort({ day: -1 })
    .limit(5)
    .populate("exercises")
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch(({ message }) => {
      console.log(message);
      res.status(500).end();
    });
});

// Get specific workout by id
router.get("/api/workout/:id", (req, res) => {
  db.Workout.find({ _id: req.params.id })
    .populate("exercises")
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch(({ message }) => {
      console.log(message);
      res.status(500).end();
    });
});

// Create new workout
router.post("/api/workout", (req, res) => {
  db.Workout.create({ name: req.body.name, day: moment().format("M/D/YYYY") })
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch(({ message }) => {
      console.log(message);
      res.status(500).end();
    });
});

// ! HTML routes
router.get("/", (req, res) => {
  db.Workout.find({})
    .sort({ day: -1 })
    .limit(5)
    .lean()
    .then((data) => {
      console.log(data);
      data.map(
        (element) => (element.day = moment(element.day).format("MMMM Do YYYY"))
      );
      res.render("index", { workout: data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
});

module.exports = router;
