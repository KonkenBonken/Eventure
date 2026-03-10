import type {Event} from "../backend/lib/event.js";
import type {Ticket} from "../backend/lib/ticket.js";

const eventsSection = document.querySelector("#events");
const ticketsSection = document.querySelector("#tickets");
const financialSummary = document.querySelector("#total");

// Check if HTML page has host attribute
const is_host = document.body.dataset.role === "host";

// Counter for total calculations
let total_spent = 0;
let total_earned = 0;

/**
 * Sums up how much a user has spent in total on event tickets
 * @param ticket The currently bought ticket's cost that will be added to the total spending
 * @returns Total of spent money
 */
function total_spending(ticket: Ticket): void {
    const get_event = (ticket: Ticket) =>
        event_list.find(event => event.event_id === ticket.event_id);
    const event = get_event(ticket);
    // Financial summary for user
    total_spent += event?.price ?? 0;
    if (financialSummary) {
        financialSummary.textContent = `Total spending: ${total_spent} kr`;
    } else {}
}

/**
 * Sums up how much a host has earned from their events
 * @param event The current events earnings to be added to the total
 * @returns Total of earned money
 */
function total_earning(event: Event): void {
    // Financial summary for host
    total_earned += (event.sold_tickets) * (event.price);
    if (financialSummary) {
        financialSummary.textContent = `Total earned: ${total_earned} kr`;
    } else {}
}


/**
 * Fetches the resource, if the server responds with status 401 (Unauthorized),
 * redirects to login page
 * @param url The url to fetch
 */
async function fetch_with_auth(url: string): Promise<Response> {
    const response = await fetch(url);
    // If unauthorized, redirect to login page
    if (response.status === 401) {
        location.href = "/login";
    } else {}
    return response;
}

/**
 * Creates an event card and appends it to the Events section.
 * When viewed by a host, the card will show host specific information.
 * @param event The event
 */
function append_event_card(event: Event): void {
    // Check if event is sold out
    function sold_out(event: Event): boolean {
        return event.capacity !== undefined && (event.capacity - event.sold_tickets) === 0;
    }

    const card = document.createElement("div");
    card.classList.add("event");
    const formatted_date = new Date(event.timestamp).toLocaleString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
    const capacity = event.capacity ?? "Unlimited";
    const book_button = document.createElement("button");
    book_button.textContent = "Book";

    card.innerHTML = `
        <h2>${event.title}</h2>
        <p>${formatted_date}<b>${event.price}:-</b></p>
        <p>${event.description}</p>
    `;

    if (is_host) {
        // If is host, show more event data
        card.innerHTML += `
            <p><b>Capacity:</b> ${capacity}</p>
            <p><b>Number of sold tickets:</b> ${event.sold_tickets}</p>
            <p><b>Earned money:</b> ${(event.sold_tickets) * (event.price)}:-</p>
        `;
    } else if (!sold_out(event)) {
        // If is not host and not sold out, show book button
        card.append(book_button);
    } else {
        // If is not host and is sold out, show book disabled button and "Sold Out" on ticket
        card.innerHTML += `<p><b>SOLD OUT</b></p>`
        book_button.disabled = true;
        card.append(book_button);
    }

    card.querySelector('button')?.addEventListener("click", async () => {
        const ticket_response = await fetch_with_auth(`/api/book/${event.event_id}`);
        const ticket_or_error = await ticket_response.json();
        if (!ticket_response.ok) {
            alert(ticket_or_error);
        } else {
            append_ticket_card(ticket_or_error);
            book_button.disabled = true;
            card.innerHTML += `<p><b>>> You're attending this event</b></p>`
        }
    });

    eventsSection?.append(card);

    // Display hosts total earnings
    if (is_host) {
        total_earning(event);
    } else {}
}


/**
 * Creates a ticket card and appends it to the Tickets section
 * and adds ticket cost to total spending
 * @param ticket The ticket record
 */
function append_ticket_card(ticket: Ticket): void {
    const get_event = (ticket: Ticket) =>
        event_list.find(event => event.event_id === ticket.event_id);

    const card = document.createElement("div");
    const {ticket_id} = ticket;
    const event = get_event(ticket);
    card.classList.add("ticket");
    card.setAttribute("tabindex", "1");
    card.innerHTML = `
        <b>${event?.title ?? "Unknown"}</b>
        <p>${event?.price}:-</p>
        <img src="/ticket_qr_code/${ticket_id}">
        <p>Ticket id: <code>${ticket_id}</code></p>
    `;

    ticketsSection?.append(card);

    // Display users total spending on tickets
    total_spending(ticket);
}

const event_list_response = await fetch_with_auth("/api/events");
const event_list: Array<Event> = await event_list_response.json();
event_list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
console.log(event_list);

const tickets_list_response = await fetch_with_auth("/api/get_tickets");
const ticket_list: Array<Ticket> = await tickets_list_response.json();
console.log(ticket_list);

for (const event of event_list) {
    append_event_card(event);
}

for (const ticket of ticket_list) {
    append_ticket_card(ticket);
}
