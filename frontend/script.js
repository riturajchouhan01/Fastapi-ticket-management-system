const API = "http://127.0.0.1:8000";

let tickets = [];


// ============================
// PAGE NAVIGATION
// ============================

function showPage(page) {

    document
        .getElementById("dashboardPage")
        .classList.add("hidden");

    document
        .getElementById("ticketsPage")
        .classList.add("hidden");

    document
        .getElementById("settingsPage")
        .classList.add("hidden");


    document
        .getElementById("dashboardMenu")
        .classList.remove("active");

    document
        .getElementById("ticketsMenu")
        .classList.remove("active");

    document
        .getElementById("settingsMenu")
        .classList.remove("active");


    if (page === "dashboard") {

        document
            .getElementById("dashboardPage")
            .classList.remove("hidden");

        document
            .getElementById("dashboardMenu")
            .classList.add("active");

    }


    if (page === "tickets") {

        document
            .getElementById("ticketsPage")
            .classList.remove("hidden");

        document
            .getElementById("ticketsMenu")
            .classList.add("active");

        displayTickets();

    }


    if (page === "settings") {

        document
            .getElementById("settingsPage")
            .classList.remove("hidden");

        document
            .getElementById("settingsMenu")
            .classList.add("active");

    }

}



// ============================
// LOAD TICKETS
// ============================

async function loadTickets() {

    try {

        const response =
            await fetch(`${API}/tickets/`);

        tickets =
            await response.json();

        displayTickets();

        displayRecentTickets();

        updateDashboard();

    }

    catch (error) {

        console.error(error);

        alert("Could not connect to backend");

    }

}



// ============================
// DISPLAY ALL TICKETS
// ============================

function displayTickets() {

    const container =
        document.getElementById(
            "ticketContainer"
        );


    if (!container) {
        return;
    }


    const search =
        document.getElementById(
            "search"
        )?.value.toLowerCase() || "";


    const statusFilter =
        document.getElementById(
            "statusFilter"
        )?.value || "All";


    const filteredTickets =
        tickets.filter(ticket => {

            const matchesSearch =
                ticket.title
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =
                statusFilter === "All" ||
                ticket.status === statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    container.innerHTML = "";


    if (filteredTickets.length === 0) {

        container.innerHTML = `
            <p style="padding:20px;color:#777">
                No tickets found.
            </p>
        `;

        return;

    }


    filteredTickets.forEach(ticket => {

        container.innerHTML +=
            createTicketHTML(ticket);

    });

}



// ============================
// RECENT TICKETS
// ============================

function displayRecentTickets() {

    const container =
        document.getElementById(
            "recentTickets"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const recent =
        tickets.slice(0, 5);


    recent.forEach(ticket => {

        container.innerHTML +=
            createTicketHTML(ticket);

    });

}



// ============================
// TICKET HTML
// ============================

function createTicketHTML(ticket) {

    return `

        <div class="ticket">

            <div>

                <h3>
                    #${ticket.id}
                    ${ticket.title}
                </h3>

                <p>
                    ${ticket.description}
                </p>

                <p>
                    Category:
                    ${ticket.category}
                </p>

            </div>


            <div class="ticket-info">

                <span class="badge
                    priority-${ticket.priority.toLowerCase()}">

                    ${ticket.priority}

                </span>


                <select
                    onchange="changeStatus(
                        ${ticket.id},
                        this.value
                    )">

                    <option
                        ${ticket.status === "Open"
                            ? "selected"
                            : ""}>

                        Open

                    </option>


                    <option
                        ${ticket.status === "In Progress"
                            ? "selected"
                            : ""}>

                        In Progress

                    </option>


                    <option
                        ${ticket.status === "Closed"
                            ? "selected"
                            : ""}>

                        Closed

                    </option>

                </select>


                <button
                    class="delete-btn"
                    onclick="deleteTicket(
                        ${ticket.id}
                    )">

                    Delete

                </button>

            </div>

        </div>

    `;

}



// ============================
// DASHBOARD COUNTS
// ============================

function updateDashboard() {

    document.getElementById(
        "totalTickets"
    ).innerText = tickets.length;


    document.getElementById(
        "openTickets"
    ).innerText =
        tickets.filter(
            t => t.status === "Open"
        ).length;


    document.getElementById(
        "progressTickets"
    ).innerText =
        tickets.filter(
            t => t.status === "In Progress"
        ).length;


    document.getElementById(
        "closedTickets"
    ).innerText =
        tickets.filter(
            t => t.status === "Closed"
        ).length;

}



// ============================
// CREATE TICKET
// ============================

async function createTicket(event) {

    event.preventDefault();


    const ticket = {

        title:
            document.getElementById(
                "title"
            ).value,

        description:
            document.getElementById(
                "description"
            ).value,

        category:
            document.getElementById(
                "category"
            ).value,

        priority:
            document.getElementById(
                "priority"
            ).value

    };


    try {

        const response =
            await fetch(
                `${API}/tickets/`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(ticket)

                }
            );


        if (!response.ok) {

            throw new Error(
                "Ticket creation failed"
            );

        }


        document
            .querySelector("form")
            .reset();


        closeTicketForm();


        await loadTickets();


    }

    catch (error) {

        console.error(error);

        alert(
            "Could not create ticket"
        );

    }

}



// ============================
// CHANGE STATUS
// ============================

async function changeStatus(
    id,
    status
) {

    try {

        await fetch(
            `${API}/tickets/${id}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        status: status
                    })

            }
        );


        await loadTickets();

    }

    catch (error) {

        console.error(error);

    }

}



// ============================
// DELETE TICKET
// ============================

async function deleteTicket(id) {

    if (
        !confirm(
            "Are you sure you want to delete this ticket?"
        )
    ) {

        return;

    }


    try {

        await fetch(
            `${API}/tickets/${id}`,
            {
                method: "DELETE"
            }
        );


        await loadTickets();

    }

    catch (error) {

        console.error(error);

    }

}



// ============================
// MODAL
// ============================

function openTicketForm() {

    document.getElementById(
        "ticketModal"
    ).style.display = "flex";

}


function closeTicketForm() {

    document.getElementById(
        "ticketModal"
    ).style.display = "none";

}



// ============================
// START
// ============================

loadTickets();
