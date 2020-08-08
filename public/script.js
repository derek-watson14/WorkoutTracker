const postNewWorkout = (workoutName) => {
  $.post("/api/workout", { name: workoutName }, (res) => {
    console.log(res._id);
  });
};

const postExerciseData = (exerciseObj, workoutid) => {
  $.post("/api/exercise/" + workoutid, exerciseObj, () => {
    getWorkoutData(workoutid);
  });
};

const getWorkoutData = (id) => {
  $("#newExercise").data("id", id);
  $.get("/api/" + id, (data) => {
    console.log(data);
    let dataObj = {
      name: data[0].name,
      day: data[0].day.slice(0, 10),
      exercises: data[0].exercises,
    };
    console.log(dataObj);
    renderWorkout(dataObj);
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
  try {
    let workoutLis = "";
    const workouts = await getRecentWorkouts();
    workouts.forEach((workout) => {
      workoutLis += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${workout.name}
          <button data-workoutId=${workout._id} class="btn btn-info view-workout">View</button>
        </li>`;
    });
    recentWorkouts.html(workoutLis);
  } catch (error) {
    console.log(`Status ${error.status} `, error.statusText);
    recentWorkouts.html(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span class="alert alert-danger m-0 w-100" role="alert">
          Error loading workouts
        </span>
      </li>
    `);
  }
}

// TODO: display workouts to the page
async function displaySingleWorkout(id) {
  try {
    const workout = await getWorkout(id);
    console.log(workout);
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
