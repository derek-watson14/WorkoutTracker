const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: false,
    required: "Exercise must have a name",
  },
  type: {
    type: String,
    trim: true,
    enum: ["cardio", "strength"],
  },
  cardioType: {
    type: String,
    trim: true,
    enum: ["run", "bike", "swim"],
  },
  weight: Number,
  sets: {
    type: Number,
    min: [1, "Must do at least one set"],
  },
  reps: {
    type: Number,
    min: [1, "Sets must have at least one rep"],
  },
  duration: Number,
  distance: Number,
  workoutId: {
    type: Schema.Types.ObjectId,
    ref: "Exercise",
  },
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
