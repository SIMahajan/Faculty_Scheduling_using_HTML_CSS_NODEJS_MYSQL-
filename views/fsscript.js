let nav = 0;
let filter_check = 4;
let results = "";
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];
var clickeddate;
const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const eventFacultyInput = document.getElementById("eventFacultyTinput");
const eventDescreptionInput = document.getElementById("eventDescreptionInput");
const eventTimeInput = document.getElementById("eventTimeInput");
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let touched;
let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    let result = this.responseText;
    results = JSON.parse(result);
  }
};
function loadEvents() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let result = this.responseText;
      results = JSON.parse(result);
      events.push(result);
      localStorage.setItem("events", JSON.stringify(events));
      load();
      results.forEach((comment) => {});
    }
  };
  // xhttp.open("GET", "/home", true); //open a 'get' request , its async
  // xhttp.send();
}

function openModal(date) {
  clicked = date;
  clickeddate = date;

  const eventForDay = events.find((e) => e.date === clicked);
  if (eventForDay) {
    document.getElementById("subject").innerText = eventForDay.title;
    document.getElementById("Faculty").innerText = eventForDay.Faculty;
    document.getElementById("time").innerText = eventForDay.Time;
    document.getElementById("Descreption").innerText = eventForDay.Descreption;
    deleteEventModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
  }
  backDrop.style.display = "block";
}

function load() {
  const dt = new Date();
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

  document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
    "en-us",
    { month: "long" }
  )}`;
  document.getElementById("yearDisplay").innerText = `${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${year}-${month + 1}-${i - paddingDays}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find((e) => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = "currentDay";
      }

      if (eventForDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener("click", () => openModal(dayString));
    } else {
      daySquare.classList.add("padding");
    }

    calendar.appendChild(daySquare);
  }
}

function closeModal() {
//   eventTitleInput.classList.remove("error");
//   eventFacultyInput.classList.remove("error");
//   eventDescreptionInput.classList.remove("error");
//   eventTimeInput.classList.remove("error");
//   newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  backDrop.style.display = "none";
//   eventTitleInput.value = "";
//   eventDescreptionInput.value = "";
//   eventFacultyInput.value = "";
//   eventTimeInput.value = "";
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value && eventDescreptionInput.value && eventFacultyInput.value && eventTimeInput.value) {
    eventTitleInput.classList.remove("error");
    eventDescreptionInput.classList.remove("error");
    eventFacultyInput.classList.remove("error");
    eventTimeInput.classList.remove("error");


    events.push({
      date: clicked,
      title: eventTitleInput.value,
      Faculty: eventFacultyInput.value,
      Descreption: eventDescreptionInput.value,
      Time: eventTimeInput.value,

    });

    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add("error");
  }
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked); //deleted the event but have to to update the sql i think
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    load();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
  });

//   document.getElementById("cancelButton").addEventListener("click", closeModal);
//   document.getElementById("saveButton").addEventListener("click", saveEvent);
  document
    // .getElementById("deleteButton").addEventListener("click", deleteEvent);
  document.getElementById("closeButton").addEventListener("click", closeModal);
}
function insertComment() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let result = this.responseText;
    }
  };
  let addClass = document.getElementsByClassName("Test");
  let description = addClass[0].value;
  let name = addClass[1].value;
  let date = "";
  if (addClass.length == 2) {
    date = clickeddate;
  } else if (addClass.length == 3) {
    let edate = addClass[2].value;
    let junk1 = edate.slice(8);
    let d = Number(junk1).toString();
    let junk = edate.slice(5, 7);
    let m = Number(junk).toString();
    let y = edate.slice(0, 4);
    date = y + "-" + m + "-" + d;
  }
// console.log(description);
  xhttp.open("POST", "/inset", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(
    '{"description":"' +
      description +
      '","name":"' +
      name +
      '","Date":"' +
      date +
      '"}'
  );
  // alert(description + name + date);
  setInterval(() => {
    loadEvents();
  }, 2000);
}

function deleteComment() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
    }
  };
  let temp = clicked;
  // xhttp.open("DELETE", "/delete", true);
  // xhttp.setRequestHeader("Content-Type", "application/json");
  // // console.log(temp);
  // xhttp.send('{"clicked":"' + temp + '"}');
}

initButtons();
load();
