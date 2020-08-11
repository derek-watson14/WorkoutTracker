function postNewWorkout(workoutName) {
  $.post("/api/workout", { name: workoutName }, (res) => {
    console.log(res._id);
  });
}

function deleteWorkout(workoutid) {
  $.ajax({
    url: `/api/workout/${workoutid}`,
    method: "DELETE",
  })
    .done((data) => {
      console.log(data);
      $.ajax({
        url: `/api/exercise/${workoutid}`,
        method: "DELETE",
      })
        .done((data) => {
          console.log(data);
        })
        .fail((err) => {
          console.log(err);
        });
    })
    .fail((err) => {
      console.log(err);
    });
}

function postNewExercise(workoutid, exerciseObj) {
  $.post("/api/exercise/" + workoutid, exerciseObj, () => {
    displaySingleWorkout(workoutid);
  });
}

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

$("#deleteWorkout").click(function () {
  const workoutid = $("#workoutId").data("id");
  console.log(workoutid);
  deleteWorkout(workoutid);
  location.reload();
});

async function displaySingleWorkout(id) {
  const titleH5 = $("#workoutTitle");
  const countH6 = $("#exerciseCount");
  const dateP = $("#workoutDate");
  const idSpan = $("#workoutId");
  const exercisesUl = $("#workoutExercises");
  const addExerciseModalBtn = $("#openExerciseModal");
  const deleteWorkoutBtn = $("#deleteWorkout");
  let exerciseLis = "";
  try {
    const workout = await getWorkout(id);
    titleH5.text(workout.name);
    countH6.text(`${workout.exercises.length} exercises`);
    dateP.text(`Workout added ${workout.date.slice(0, 10)}`);
    idSpan.attr("data-id", workout._id);
    if (workout.exercises.length > 0) {
      workout.exercises.forEach((exercise) => {
        let exerciseInfo = "";
        let colorClass = "";
        if (exercise.type === "cardio") {
          exerciseInfo = `
            <p class="m-0 py-3 px-4">${exercise.distance}km ${exercise.cardioType} - ${exercise.duration} minutes</p>
          `;
          colorClass = "list-group-item-secondary";
        } else {
          exerciseInfo = `
            <p class="m-0 py-3 px-4">${exercise.weight}kg - ${exercise.sets} sets of ${exercise.reps} reps</p>
          `;
          colorClass = "list-group-item-dark";
        }
        exerciseLis += `
          <li class="list-group-item ${colorClass} d-flex justify-content-between align-items-center">
            ${exercise.name}
            <button 
              data-workoutId=${exercise._id} 
              class="btn btn-info" 
              data-toggle="collapse"
              data-target="#collapse-${exercise._id}"
              role="button" 
              aria-expanded="false" 
              aria-controls="collapse-${exercise._id}"
            >
                View
            </button>
          </li>
          <div class="collapse" id="collapse-${exercise._id}">
            ${exerciseInfo}
          </div>
        `;
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
    addExerciseModalBtn.removeClass("d-none");
    deleteWorkoutBtn.removeClass("d-none");
  } catch (error) {
    addExerciseModalBtn.addClass("d-none");
    deleteWorkoutBtn.addClass("d-none");
    console.log(error);
  }
}

$(document).on("click", ".view-workout", function () {
  const id = $(this).data("workoutid");
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

$("#addCardioForm").submit(function (event) {
  event.preventDefault();
  const exerciseObj = {
    name: $("#cardioExerciseName").val(),
    type: "cardio",
    cardioType: $("#cardioType").val(),
    distance: $("#distance").val(),
    duration: $("#duration").val(),
    workoutId: $("#workoutId").data("id"),
  };
  postNewExercise($("#workoutId").data("id"), exerciseObj);
  $("#cardioExerciseName").val("");
  $("#duration").val("");
  $("#distance").val("");
  $("#cardioType").val("");
  $("#addCardioModal").modal("hide");
});

$("#addStrengthForm").submit(function (event) {
  event.preventDefault();
  const exerciseObj = {
    name: $("#stengthExerciseName").val(),
    type: "strength",
    weight: $("#weight").val(),
    sets: $("#sets").val(),
    reps: $("#reps").val(),
    workoutId: $("#workoutId").data("id"),
  };
  postNewExercise($("#workoutId").data("id"), exerciseObj);
  $("#stengthExerciseName").val("");
  $("#weight").val("");
  $("#sets").val("");
  $("#reps").val("");
  $("#addStrengthModal").modal("hide");
});

$("#workoutName").keyup(function (event) {
  if ($("#workoutName").val()) {
    $("#noWorkoutNameAlert").addClass("d-none");
  }
});

$(document).ready(async function () {
  displayRecentWorkouts();
});
