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
    .sort({ timestamp: -1 })
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
  db.Workout.findOne({ _id: req.params.id })
    .lean()
    .populate("exercises")
    .then((dbWorkout) => {
      res.json({ ...dbWorkout });
    })
    .catch(({ message }) => {
      console.log(message);
      res.status(500).end();
    });
});

// Create new workout
router.post("/api/workout", (req, res) => {
  db.Workout.create({
    name: req.body.name,
    date: moment().format("M/D/YYYY"),
    timestamp: moment(),
  })
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch(({ message }) => {
      console.log(message);
      res.status(500).end();
    });
});

// Delete workout
router.delete("/api/workout/:id", (req, res) => {
  db.Workout.deleteOne({
    _id: req.params.id,
  })
    .then((deletion) => {
      res.json(deletion);
    })
    .catch(({ message }) => {
      console.log(message);
      res.status(500).end();
    });
});

router.delete("/api/exercise/:workoutid", (req, res) => {
  db.Exercise.deleteMany({
    workoutId: req.params.workoutid,
  })
    .then((deletion) => {
      res.json(deletion);
    })
    .catch(({ message }) => {
      console.log(message);
      res.status(500).end();
    });
});

// ! HTML routes
router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
