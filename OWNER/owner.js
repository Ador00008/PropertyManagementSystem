
// ==========================================
// OWNER MODULE - JAVASCRIPT
// ==========================================


// ==========================================
// 1. GET LOGGED-IN OWNER INFORMATION
// ==========================================

let ownerCurrentUser = null;

try {
    ownerCurrentUser = JSON.parse(localStorage.getItem("user"));
} catch (error) {
    ownerCurrentUser = null;
}


// Check whether user is logged in as Owner

if (
    !ownerCurrentUser ||
    !ownerCurrentUser.role ||
    ownerCurrentUser.role.toLowerCase() !== "owner"
) {
    alert("Please login as an Owner first.");
    window.location.href = "../LOGIN/login.html";
}


// Display owner's name

if (ownerCurrentUser) {
    document.getElementById("owner-user-name").textContent =
        ownerCurrentUser.name || "Owner";

    document.querySelector(".owner-avatar").textContent =
        (ownerCurrentUser.name || "O").charAt(0).toUpperCase();
}


// ==========================================
// 2. OWNER PROPERTY DATA
// ==========================================

// Separate localStorage key for Owner properties

let ownerProperties = [];

try {
    ownerProperties = JSON.parse(
        localStorage.getItem("ownerProperties")
    ) || [];
} catch (error) {
    ownerProperties = [];
}


// Save Owner properties

function ownerSaveProperties() {
    localStorage.setItem(
        "ownerProperties",
        JSON.stringify(ownerProperties)
    );
}


// Get only the logged-in owner's properties

function ownerGetMyProperties() {
    if (!ownerCurrentUser) {
        return [];
    }

    return ownerProperties.filter(function (property) {
        return property.ownerName === ownerCurrentUser.name;
    });
}


// Escape HTML before displaying user-provided text

function ownerEscapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}


// ==========================================
// 3. SHOW DIFFERENT DASHBOARD SECTIONS
// ==========================================

window.ownerShowSection = function (sectionId) {

    const sections = document.querySelectorAll(".owner-section");

    sections.forEach(function (section) {
        section.classList.remove("owner-section-active");
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("owner-section-active");
    }

    // Update active navigation button

    const navButtons = document.querySelectorAll(".owner-nav-link");

    navButtons.forEach(function (button) {
        button.classList.remove("owner-active");
    });

    const activeButton = document.querySelector(
        `.owner-nav-link[onclick*="${sectionId}"]`
    );

    if (activeButton) {
        activeButton.classList.add("owner-active");
    }

};


// ==========================================
// 4. ADD PROPERTY
// ==========================================

const ownerPropertyForm = document.getElementById(
    "owner-property-form"
);

let ownerEditingPropertyId = null;


ownerPropertyForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (!ownerCurrentUser) {
        return;
    }

    // Get values from form

    const title = document.getElementById(
        "owner-property-title"
    ).value.trim();

    const location = document.getElementById(
        "owner-property-location"
    ).value.trim();

    const type = document.getElementById(
        "owner-property-type"
    ).value;

    const price = Number(document.getElementById(
        "owner-property-price"
    ).value);

    const beds = Number(document.getElementById(
        "owner-property-beds"
    ).value);

    const baths = Number(document.getElementById(
        "owner-property-baths"
    ).value);

    const area = Number(document.getElementById(
        "owner-property-area"
    ).value);

    const image = document.getElementById(
        "owner-property-image"
    ).value.trim();

    const description = document.getElementById(
        "owner-property-description"
    ).value.trim();


    // Validate property information

    if (
        !title ||
        !location ||
        !type ||
        price <= 0 ||
        beds < 0 ||
        baths < 0 ||
        area <= 0
    ) {
        alert("Please enter valid property information.");
        return;
    }


    // Create property object

    const propertyData = {
        title: title,
        location: location,
        type: type,
        price: price,
        beds: beds,
        baths: baths,
        area: area,
        image: image,
        description: description,
        ownerName: ownerCurrentUser.name
    };


    // EDIT EXISTING PROPERTY

    if (ownerEditingPropertyId !== null) {

        const propertyIndex = ownerProperties.findIndex(
            function (property) {
                return property.id === ownerEditingPropertyId &&
                    property.ownerName === ownerCurrentUser.name;
            }
        );

        if (propertyIndex === -1) {
            alert("Property not found.");
            return;
        }

        ownerProperties[propertyIndex] = {
            ...ownerProperties[propertyIndex],
            ...propertyData
        };

        alert("Property updated successfully.");

        ownerEditingPropertyId = null;

        document.getElementById(
            "owner-submit-btn"
        ).textContent = "Add Property";

    }

    // ADD NEW PROPERTY

    else {

        propertyData.id = Date.now();

        ownerProperties.push(propertyData);

        alert("Property added successfully.");

    }


    // Save and refresh dashboard

    ownerSaveProperties();

    ownerPropertyForm.reset();

    ownerUpdateDashboard();

    ownerShowSection("owner-my-properties");

});


// ==========================================
// 5. DISPLAY OWNER PROPERTIES
// ==========================================

function ownerRenderProperties() {

    const propertyList = document.getElementById(
        "owner-property-list"
    );

    const myProperties = ownerGetMyProperties();

    propertyList.innerHTML = "";


    if (myProperties.length === 0) {

        propertyList.innerHTML = `
            <p class="owner-empty-message">
                No properties available.
                Add your first property.
            </p>
        `;

        return;
    }


    myProperties.forEach(function (property) {

        const propertyCard = document.createElement("div");

        propertyCard.className = "owner-property-card";

        propertyCard.innerHTML = `

            ${
                property.image
                    ? `<img src="${ownerEscapeHTML(property.image)}"
                        alt="${ownerEscapeHTML(property.title)}">`
                    : ""
            }

            <div class="owner-property-details">

                <h3>${ownerEscapeHTML(property.title)}</h3>

                <p>📍 ${ownerEscapeHTML(property.location)}</p>

                <p>Type: ${ownerEscapeHTML(property.type)}</p>

                <p>🛏 ${property.beds} Bedrooms |
                   🛁 ${property.baths} Bathrooms</p>

                <p>📐 ${property.area} sqft</p>

                <div class="owner-property-price">
                    Tk ${Number(property.price).toLocaleString("en-BD")}
                    / month
                </div>

                <p>${ownerEscapeHTML(property.description)}</p>

                <div class="owner-property-actions">

                    <button
                        class="owner-edit-btn"
                        data-action="edit"
                        data-id="${property.id}">
                        Edit
                    </button>

                    <button
                        class="owner-delete-btn"
                        data-action="delete"
                        data-id="${property.id}">
                        Delete
                    </button>

                </div>

            </div>

        `;

        propertyList.appendChild(propertyCard);

    });

}


// ==========================================
// 6. EDIT AND DELETE PROPERTY
// ==========================================

document.getElementById(
    "owner-property-list"
).addEventListener("click", function (event) {

    const actionButton = event.target.closest(
        "button[data-action]"
    );

    if (!actionButton) {
        return;
    }

    const propertyId = Number(actionButton.dataset.id);

    const action = actionButton.dataset.action;


    // Find property belonging to current owner

    const selectedProperty = ownerProperties.find(
        function (property) {
            return property.id === propertyId &&
                property.ownerName === ownerCurrentUser.name;
        }
    );

    if (!selectedProperty) {
        alert("Property not found.");
        return;
    }


    // EDIT PROPERTY

    if (action === "edit") {

        ownerEditingPropertyId = propertyId;

        document.getElementById(
            "owner-property-title"
        ).value = selectedProperty.title;

        document.getElementById(
            "owner-property-location"
        ).value = selectedProperty.location;

        document.getElementById(
            "owner-property-type"
        ).value = selectedProperty.type;

        document.getElementById(
            "owner-property-price"
        ).value = selectedProperty.price;

        document.getElementById(
            "owner-property-beds"
        ).value = selectedProperty.beds;

        document.getElementById(
            "owner-property-baths"
        ).value = selectedProperty.baths;

        document.getElementById(
            "owner-property-area"
        ).value = selectedProperty.area;

        document.getElementById(
            "owner-property-image"
        ).value = selectedProperty.image || "";

        document.getElementById(
            "owner-property-description"
        ).value = selectedProperty.description || "";


        document.getElementById(
            "owner-submit-btn"
        ).textContent = "Update Property";

        ownerShowSection("owner-add-property");

    }


    // DELETE PROPERTY

    else if (action === "delete") {

        const confirmation = confirm(
            "Are you sure you want to delete this property?"
        );

        if (confirmation) {

            ownerProperties = ownerProperties.filter(
                function (property) {
                    return property.id !== propertyId;
                }
            );

            ownerSaveProperties();

            ownerUpdateDashboard();

            alert("Property deleted successfully.");

        }

    }

});


// Reset editing mode if form is cleared

ownerPropertyForm.addEventListener("reset", function () {

    ownerEditingPropertyId = null;

    document.getElementById(
        "owner-submit-btn"
    ).textContent = "Add Property";

});


// ==========================================
// 7. DISPLAY RECENT PROPERTIES
// ==========================================

function ownerRenderRecentProperties() {

    const recentList = document.getElementById(
        "owner-recent-properties"
    );

    const myProperties = ownerGetMyProperties();

    recentList.innerHTML = "";


    if (myProperties.length === 0) {

        recentList.innerHTML = `
            <p class="owner-empty-message">
                No properties added yet.
            </p>
        `;

        return;
    }


    const recentProperties = myProperties.slice(-3).reverse();

    recentProperties.forEach(function (property) {

        const recentItem = document.createElement("div");

        recentItem.className = "owner-recent-item";

        recentItem.innerHTML = `

            <div>
                <h3>${ownerEscapeHTML(property.title)}</h3>

                <p>${ownerEscapeHTML(property.location)}</p>
            </div>

            <strong>
                Tk ${Number(property.price).toLocaleString("en-BD")}
            </strong>

        `;

        recentList.appendChild(recentItem);

    });

}


// ==========================================
// 8. APPOINTMENT DATA
// ==========================================

// Read shared appointment data if available.
// Renter integration will be done separately.

let ownerAppointments = [];

try {
    ownerAppointments = JSON.parse(
        localStorage.getItem("appointments")
    ) || [];
} catch (error) {
    ownerAppointments = [];
}


// Save appointment data

function ownerSaveAppointments() {

    localStorage.setItem(
        "appointments",
        JSON.stringify(ownerAppointments)
    );

}


// ==========================================
// 9. DISPLAY APPOINTMENTS
// ==========================================

function ownerRenderAppointments() {

    const appointmentBody = document.getElementById(
        "owner-appointment-body"
    );

    const myProperties = ownerGetMyProperties();

    const myPropertyNames = myProperties.map(
        function (property) {
            return property.title;
        }
    );


    // Show only appointments for this owner's properties

    const myAppointments = ownerAppointments.filter(
        function (appointment) {
            return myPropertyNames.includes(appointment.property);
        }
    );


    appointmentBody.innerHTML = "";


    if (myAppointments.length === 0) {

        appointmentBody.innerHTML = `
            <tr>
                <td colspan="7" class="owner-empty-message">
                    No appointment requests available.
                </td>
            </tr>
        `;

        return;
    }


    myAppointments.forEach(function (appointment) {

        const appointmentRow = document.createElement("tr");

        const appointmentStatus = appointment.status || "Pending";

        appointmentRow.innerHTML = `

            <td>
                ${ownerEscapeHTML(
                    appointment.renterName ||
                    appointment.name ||
                    "Renter"
                )}
            </td>

            <td>${ownerEscapeHTML(appointment.property)}</td>

            <td>${ownerEscapeHTML(appointment.date)}</td>

            <td>${ownerEscapeHTML(appointment.time)}</td>

            <td>${ownerEscapeHTML(appointment.note || "—")}</td>

            <td>${ownerEscapeHTML(appointmentStatus)}</td>

            <td>

                ${
                    appointmentStatus === "Pending"
                        ? `
                            <button
                                class="owner-approve-btn"
                                data-action="approve"
                                data-id="${appointment.id}">
                                Approve
                            </button>

                            <button
                                class="owner-reject-btn"
                                data-action="reject"
                                data-id="${appointment.id}">
                                Reject
                            </button>
                        `
                        : "No action"
                }

            </td>

        `;

        appointmentBody.appendChild(appointmentRow);

    });

}


// ==========================================
// 10. APPROVE OR REJECT APPOINTMENTS
// ==========================================

document.getElementById(
    "owner-appointment-body"
).addEventListener("click", function (event) {

    const actionButton = event.target.closest(
        "button[data-action]"
    );

    if (!actionButton) {
        return;
    }

    const appointmentId = Number(actionButton.dataset.id);

    const action = actionButton.dataset.action;


    const selectedAppointment = ownerAppointments.find(
        function (appointment) {
            return Number(appointment.id) === appointmentId;
        }
    );

    if (!selectedAppointment) {
        alert("Appointment not found.");
        return;
    }


    if (action === "approve") {

        selectedAppointment.status = "Approved";

        alert("Appointment approved successfully.");

    }

    else if (action === "reject") {

        selectedAppointment.status = "Rejected";

        alert("Appointment rejected.");

    }


    ownerSaveAppointments();

    ownerUpdateDashboard();

});


// ==========================================
// 11. UPDATE DASHBOARD STATISTICS
// ==========================================

function ownerUpdateDashboard() {

    const myProperties = ownerGetMyProperties();

    const myPropertyNames = myProperties.map(
        function (property) {
            return property.title;
        }
    );

    const myAppointments = ownerAppointments.filter(
        function (appointment) {
            return myPropertyNames.includes(appointment.property);
        }
    );


    // Total properties

    document.getElementById(
        "owner-total-properties"
    ).textContent = myProperties.length;


    // Total appointments

    document.getElementById(
        "owner-total-appointments"
    ).textContent = myAppointments.length;


    // Pending appointments

    const pendingCount = myAppointments.filter(
        function (appointment) {
            return (appointment.status || "Pending") === "Pending";
        }
    ).length;

    document.getElementById(
        "owner-pending-appointments"
    ).textContent = pendingCount;


    // Approved appointments

    const approvedCount = myAppointments.filter(
        function (appointment) {
            return appointment.status === "Approved";
        }
    ).length;

    document.getElementById(
        "owner-approved-appointments"
    ).textContent = approvedCount;


    // Refresh all dashboard sections

    ownerRenderProperties();

    ownerRenderRecentProperties();

    ownerRenderAppointments();

}


// ==========================================
// 12. INITIALIZE OWNER DASHBOARD
// ==========================================

ownerUpdateDashboard();

console.log("Owner Dashboard loaded successfully.");

