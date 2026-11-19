const properties = [
  { name: "Green Villa", location: "Dhanmondi", rent: 25000, rooms: 3 },
  { name: "Lake View Apartment", location: "Gulshan", rent: 40000, rooms: 4 },
  { name: "Family Flat", location: "Mirpur", rent: 15000, rooms: 2 },
  { name: "Student Room", location: "Kuril", rent: 8000, rooms: 1 },
  { name: "Sunny Duplex", location: "Uttara", rent: 35000, rooms: 5 },
  { name: "Cozy Studio", location: "Banani", rent: 18000, rooms: 1 }
];

let favorites = [];

let appointments = [
  { property: "Lake View Apartment", date: "2026-11-02", time: "10:00 AM", note: "Need parking info", status: "Approved" },
  { property: "Family Flat", date: "2026-11-05", time: "3:00 PM", note: "—", status: "Rejected" },
  { property: "Green Villa", date: "2026-11-08", time: "12:00 PM", note: "Coming with family", status: "Pending" }
];

let currentFilter = "All";

const sections = ["properties", "favorites", "book", "appointments"];
const statuses = ["All", "Pending", "Approved", "Rejected"];

function showSection(name) {
  for (const s of sections) {
    document.getElementById(s).style.display = "none";
    let tab = document.getElementById("tab-" + s);
    tab.style.color = "";
    tab.style.borderBottom = "";
  }
  document.getElementById(name).style.display = "block";
  let active = document.getElementById("tab-" + name);
  active.style.color = "#663399";
  active.style.borderBottom = "3px solid #663399";
}

function showProperties() {
  let search = document.getElementById("search").value.toLowerCase();
  let maxRent = document.getElementById("maxRent").value;
  let text = "";
  let found = 0;

  for (let i = 0; i < properties.length; i++) {
    let p = properties[i];
    let nameMatch = p.name.toLowerCase().indexOf(search) !== -1;
    let locationMatch = p.location.toLowerCase().indexOf(search) !== -1;
    let rentMatch = maxRent === "all" || p.rent <= maxRent;

    if ((nameMatch || locationMatch) && rentMatch) {
      found++;

      let favText = "♡ Favorite";
      let favClass = "fav-btn";
      if (favorites.includes(p.name)) {
        favText = "Saved";
        favClass = "fav-btn saved";
      }

      text += "<div class='card'>" +
                "<span class='pill'>" + p.location + "</span>" +
                "<h3>" + p.name + "</h3>" +
                "<p class='details'>" + p.rooms + " room(s)</p>" +
                "<p class='rent'>" + p.rent + " Tk <span class='per'>/ month</span></p>" +
                "<button class='" + favClass + "' onclick='toggleFavorite(" + i + ")'>" + favText + "</button>" +
                "<button onclick='bookProperty(" + i + ")'>Book Visit</button>" +
              "</div>";
    }
  }

  if (found === 0) {
    text = "<p class='hint'>No property matches your search.</p>";
  }
  document.getElementById("propertyList").innerHTML = text;
  document.getElementById("resultCount").innerHTML = found + " property(s) found";
}

function toggleFavorite(i) {
  let name = properties[i].name;

  if (favorites.includes(name)) {
    let newList = [];
    for (let j = 0; j < favorites.length; j++) {
      if (favorites[j] !== name) {
        newList.push(favorites[j]);
      }
    }
    favorites = newList;
  } else {
    favorites.push(name);
  }

  showProperties();
  showFavorites();
  updateStats();
}

function showFavorites() {
  let text = "";
  for (let i = 0; i < properties.length; i++) {
    let p = properties[i];
    if (favorites.includes(p.name)) {
      text += "<div class='fav-item'>" +
                "<div>" +
                  "<h4>" + p.name + "</h4>" +
                  "<p>" + p.location + " · " + p.rooms + " room(s) · " + p.rent + " Tk / month</p>" +
                "</div>" +
                "<div class='fav-actions'>" +
                  "<button onclick='bookProperty(" + i + ")'>Book Visit</button>" +
                  "<button class='remove-btn' onclick='toggleFavorite(" + i + ")'>Remove</button>" +
                "</div>" +
              "</div>";
    }
  }
  if (text === "") {
    text = "<div class='empty-box'>No favorites yet. Click ♡ Favorite on a property to save it here.</div>";
  }
  document.getElementById("favList").innerHTML = text;
}

function fillPropertySelect() {
  let text = "<option value=''>-- Select Property --</option>";
  for (const p of properties) {
    text += "<option value='" + p.name + "'>" + p.name + " (" + p.location + ")</option>";
  }
  document.getElementById("property").innerHTML = text;
}

function bookProperty(i) {
  document.getElementById("property").value = properties[i].name;
  showSection("book");
  showMessage("Selected " + properties[i].name + ". Now pick a date and time.", "green");
}

function countNote() {
  let length = document.getElementById("note").value.length;
  let counter = document.getElementById("noteCount");
  counter.innerHTML = length + " / 100 characters";
  if (length > 100) {
    counter.style.color = "red";
  } else {
    counter.style.color = "";
  }
}

function showMessage(text, color) {
  let msg = document.getElementById("formMsg");
  msg.innerHTML = text;

  if (text === "") {
    msg.style.display = "none";
  } else if (color === "green") {
    msg.style.display = "block";
    msg.style.color = "#1e7b3c";
    msg.style.backgroundColor = "#e3f5e9";
  } else {
    msg.style.display = "block";
    msg.style.color = "#c0392b";
    msg.style.backgroundColor = "#fde8e8";
  }
}

function clearForm() {
  showMessage("", "");
  document.getElementById("property").style.border = "";
  document.getElementById("date").style.border = "";
  document.getElementById("time").style.border = "";
  document.getElementById("noteCount").innerHTML = "0 / 100 characters";
  document.getElementById("noteCount").style.color = "";
}

function bookAppointment() {
  let propertyBox = document.getElementById("property");
  let dateBox = document.getElementById("date");
  let timeBox = document.getElementById("time");
  let note = document.getElementById("note").value;

  propertyBox.style.border = "";
  dateBox.style.border = "";
  timeBox.style.border = "";

  let error = "";
  if (propertyBox.value === "") {
    error = "Please select a property.";
    propertyBox.style.border = "2px solid red";
  } else if (dateBox.value === "") {
    error = "Please pick a date.";
    dateBox.style.border = "2px solid red";
  } else if (timeBox.value === "") {
    error = "Please pick a time.";
    timeBox.style.border = "2px solid red";
  } else if (note.length > 100) {
    error = "Note must be 100 characters or less.";
  } else {
    for (const a of appointments) {
      if (a.property === propertyBox.value && a.date === dateBox.value && a.time === timeBox.value) {
        error = "You already booked this property at this date and time.";
      }
    }
  }

  if (error !== "") {
    showMessage(error, "red");
    return false;
  }

  if (note === "") {
    note = "—";
  }
  appointments.push({
    property: propertyBox.value,
    date: dateBox.value,
    time: timeBox.value,
    note: note,
    status: "Pending"
  });

  renderAppointments();
  updateStats();
  showMessage("Booked! " + propertyBox.value + " on " + dateBox.value + " at " + timeBox.value + " is now Pending.", "green");

  propertyBox.value = "";
  dateBox.value = "";
  timeBox.value = "";
  document.getElementById("note").value = "";
  countNote();

  return false;
}

function countStatus(status) {
  if (status === "All") {
    return appointments.length;
  }
  let count = 0;
  for (const a of appointments) {
    if (a.status === status) {
      count++;
    }
  }
  return count;
}

function filterStatus(status) {
  currentFilter = status;
  renderAppointments();
}

function renderAppointments() {
  
  for (const s of statuses) {
    let btn = document.getElementById("filter-" + s);
    btn.innerHTML = s + " (" + countStatus(s) + ")";
    if (s === currentFilter) {
      btn.style.backgroundColor = "#663399";
      btn.style.color = "white";
    } else {
      btn.style.backgroundColor = "";
      btn.style.color = "";
    }
  }

  let text = "";
  for (const a of appointments) {
    if (currentFilter === "All" || a.status === currentFilter) {
      text += "<tr>" +
                "<td><strong>" + a.property + "</strong></td>" +
                "<td>" + a.date + "</td>" +
                "<td>" + a.time + "</td>" +
                "<td>" + a.note + "</td>" +
                "<td><span class='status " + a.status.toLowerCase() + "'>" + a.status + "</span></td>" +
              "</tr>";
    }
  }
  document.getElementById("apptBody").innerHTML = text;

  if (text === "") {
    document.getElementById("noAppt").innerHTML = "No " + currentFilter.toLowerCase() + " appointments.";
  } else {
    document.getElementById("noAppt").innerHTML = "";
  }
}

function updateStats() {
  document.getElementById("favCount").innerHTML = favorites.length;
  document.getElementById("apptCount").innerHTML = appointments.length;
  document.getElementById("pendingCount").innerHTML = countStatus("Pending");
}

fillPropertySelect();
showProperties();
showFavorites();
renderAppointments();
updateStats();
showSection("properties");