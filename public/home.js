var workouts = new Array();
var checkbox = "<input type=\"checkbox\" class=\"box\" onclick=\"checkCheckboxes()\">";
var doneAlert = "<div class=\"alert alert-success alert-dismissible center-block\" role=\"alert\" id=\"doneAlert\"><span type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></span>Congrats! You like... totes <strong>yeeted</strong> your workout, yo...</div>";

window.onload = init;

function init() {
    getWorkoutData();
}

function getWorkoutData() {
    var request = new XMLHttpRequest();
    var date = new Date();
    var month = date.getMonth() + 1
    var year = date.getFullYear();
    if (month < 10) { month = '0' + month; }
    var filename = "./resources/workouts_" + month + '_' + year + ".json";
    request.open("GET", filename);
    request.onreadystatechange = function() {
        if (this.readyState == this.DONE && this.status == 200) {
            if (this.responseText) {
                parseWorkoutItems(this.responseText);
                addWorkoutToPage();
            } else {
                console.log("Error: Data is empty");
            }
        }
    };
    request.send();
}

function parseWorkoutItems(json) {
    if (json == null || json.trim() == "") { return; }
    var workoutArray = JSON.parse(json);
    if (workoutArray.length == 0) {
        console.log("Error: the to-do list array is empty");
        return;
    }
    for (var i = 0; i < workoutArray.length; i++) {
        var workoutItem = workoutArray[i];
        workouts.push(workoutItem);
    }
    console.log(workouts);
}

function addWorkoutToPage() {
    var cardioUl = document.getElementById("cardio");
    var workoutUl = document.getElementById("workout");
    var coreUl = document.getElementById("core");
    var date = getDate();
    document.getElementById("date").innerHTML = date
    for (var i = 0; i < workouts.length; i++) {
        if (workouts[i]["Date"] === date) {
            var workout = workouts[i];
            appendCardio(workout["Cardio"], cardioUl);
            appendWorkout(workout["Workout"], workoutUl);
            appendWorkout(workout["Core"], coreUl);
        }
    }
}

function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
    return mm + '-' + dd + '-' + yyyy;
}

function appendCardio(cardio, ul) {
    for (var i = 0; i < cardio.length; i++) {
        var li = document.createElement("li");
        li.innerHTML = checkbox + ' ' + cardio[i]["Exercise"] + ' ' + cardio[i]["Distance"];
        ul.appendChild(li);
    }
    return ul;
}

function appendWorkout(workout, ul) {
    for (var i = 0; i < workout.length; i++) {
        var li = document.createElement("li");
        if (workout[i].hasOwnProperty("Duration")) {
            li.innerHTML = checkbox + ' ' + workout[i]["Exercise"] + " (" + workout[i]["Sets"] + " x " + workout[i]["Duration"] + ")";
        } else {
            li.innerHTML = checkbox + ' ' + workout[i]["Exercise"] + " (" + workout[i]["Sets"] + " x " + workout[i]["Reps"] + ")";
        }
        ul.appendChild(li);
    }
    return ul;
}

$("input[type='checkbox'].box").change(function() {
    console.log("Checking...");
    var a = $("input[type='checkbox'].box");
    if (a.length == a.filter(":checked").length) {
        // Show workout completed message
        alert("Finished workout!");
        $('#finishedAlert').show();
    }
});

function checkCheckboxes() {
    var allChecked = true;
    $('input.box').each(function(index, element) {
        if (!element.checked) {
            allChecked = false;
            $('.alert').remove();
        }
    });
    if (allChecked) {
        $('#listContainer').append(doneAlert);
    }
}

function handleSignOut() {
    firebase.auth().signOut().then(function() {
        // Sign out successful
        console.log("Sign out successful");
        location.href = "index.html";
    }).catch(function(error) {
        // Sign out failed
    });
}

$('#signOutButton').click(function(e) {
    e.preventDefault();
    handleSignOut();
});