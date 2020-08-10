const postNewWorkout = (workoutName) => {
  $.post("/api/workout", { name: workoutName }, (res) => {
    console.log(res._id);
  });
};

const postNewExercise = (exerciseObj, workoutid) => {
  $.post("/api/exercise/" + workoutid, exerciseObj, () => {
    getWorkoutData(workoutid);
  });
};

async function getRecentWorkouts() {
  try {
    return await $.get("/api/workout");
  } catch (error) {
    return error;
  }
}

async function getWorkout(id) {
  try {
    return await $.get(`/api/workout/${id}`);
  } catch (error) {
    return error;
  }
}

async function displayRecentWorkouts() {
  const recentWorkouts = $("#recentWorkouts");
  const lastDate = $("#lastWorkoutDate");
  const recentCount = $("#recentCount");
  try {
    let workoutLis = "";
    const workouts = await getRecentWorkouts();
    if (workouts.length > 0) {
      lastDate.text(`Last workout on ${workouts[0].date.slice(0, 10)}`);
      recentCount.text(
        workouts.length > 1
          ? `Displaying ${workouts.length} most recent workouts`
          : "Displaying most recent workout"
      );
      workouts.forEach((workout) => {
        workoutLis += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            ${workout.name}
            <button data-workoutId=${workout._id} class="btn btn-info view-workout">View</button>
          </li>`;
      });
      recentWorkouts.html(workoutLis);
    } else {
      recentWorkouts.html(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span class="alert alert-secondary m-0 w-100" role="alert">
          No workouts to display
        </span>
      </li>
    `);
    }
  } catch (error) {
    console.log(error);
    recentWorkouts.html(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span class="alert alert-danger m-0 w-100" role="alert">
          Error loading workouts
        </span>
      </li>
    `);
  }
}

async function displaySingleWorkout(id) {
  const titleH5 = $("#workoutTitle");
  const countH6 = $("#exerciseCount");
  const dateP = $("#workoutDate");
  const exercisesUl = $("#workoutExercises");
  let exerciseLis;
  try {
    const workout = await getWorkout(id);
    console.log(workout);
    titleH5.text(workout.name);
    countH6.text(`${workout.exercises.length} exercises`);
    dateP.text(`Workout added ${workout.date.slice(0, 10)}`);
    if (workout.exercises.length > 0) {
      workout.exercises.forEach((exercise) => {
        exerciseLis += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            ${exercise.name}
            <button data-workoutId=${exercise._id} class="btn btn-info view-workout">View</button>
          </li>`;
      });
      exercisesUl.html(exerciseLis);
    } else {
      exercisesUl.html(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span class="alert alert-secondary m-0 w-100" role="alert">
          This workout contains no exercises
        </span>
      </li>
      `);
    }
  } catch (error) {
    console.log(error);
  }
}

$(document).on("click", ".view-workout", function () {
  const id = $(this).data("workoutid");
  console.log("view workout id: ", id);
  displaySingleWorkout(id);
});

$("#addWorkoutForm").submit(function (event) {
  event.preventDefault();
  const name = $("#workoutName").val();
  if (name) {
    console.log("name", $("#noWorkoutNameAlert"));
    postNewWorkout(name);
    $("#addWorkoutModal").modal("toggle");
    location.reload();
  } else {
    console.log("no name", $("#noWorkoutNameAlert"));
    $("#noWorkoutNameAlert").removeClass("d-none");
  }
});

$("#workoutName").keyup(function (event) {
  if ($("#workoutName").val()) {
    $("#noWorkoutNameAlert").addClass("d-none");
  }
});

$(document).ready(async function () {
  displayRecentWorkouts();
});
