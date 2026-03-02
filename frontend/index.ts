import type {Event} from "../backend/lib/event.js";
import {TicketId, UserId} from "../backend/lib/generate_ids.js";
import {Ticket} from "../backend/lib/ticket.js";
import {User} from "../backend/lib/users.js";

const eventsSection = document.querySelector("#events");
const ticketsSection = document.querySelector("#tickets");

// Check if HTML page has host attribute
const is_host = document.body.dataset.role === "host";

/**
 * Appends user_id to the url and fetches the resource,
 * if the server responds with status 401 (Unauthorized),
 * request a new user_id and then retry the fetch. Only retries once
 * @param url The base url, excluding `/{user_id}`
 */
async function fetch_with_user_id(url: string): Promise<Response> {
    const response = await fetch(`${url}/${user_id}`);
    // If invalid user id, request new and retry
    if (response.status === 401) {
        await get_new_user_id();
        return fetch(`${url}/${user_id}`);
    } else {
        return response;
    }
}

/**
 * Creates an event card and appends it to the Events section
 * @param event The event
 */
function append_event_card(event: Event, is_host: Boolean): void {
    const card = document.createElement("div");
    card.classList.add("event");
    card.innerHTML = `
        <hr>
        <h2>${event.title}</h2>
        <p>${event.description}</p>
        <p>${event.price}:-</p>
        ${is_host ? "" : `<button class="book-btn">Book</button>`}
    `;

    card.querySelector('button')?.addEventListener('click', async () => {
        const ticket_response = await fetch_with_user_id(`/api/book/${event.event_id}`);
        if (ticket_response.status === 409) {
            alert(`Sorry, ${event.title} is sold out`);
        } else {
            const ticket_id: TicketId = await ticket_response.text();
            append_ticket_card(ticket_id);
        }
    });

    eventsSection?.append(card);
}

/**
 * Creates a ticket card and appends it to the Tickets section
 * @param ticket_id The ticket id
 */
function append_ticket_card(ticket_id: TicketId): void {
    const card = document.createElement("div");
    card.classList.add("ticket");
    card.innerHTML = `
        <p>Ticket id: <code>${ticket_id}</code></p>
        <img src="/ticket_qr_code/${ticket_id}">
    `;

    ticketsSection?.append(card);
}

const event_list_response = await fetch('/api/events');
const event_list: Array<Event> = await event_list_response.json();
console.log(event_list);

/**
 * Fetches a new user id, stores it in local storage and updates user_id
 */
async function get_new_user_id() {
    // Request new user id
    const user_id_response = await fetch('/api/get_new_user_id');
    const user_obj: User = await user_id_response.json();
    const new_user_id = user_obj.user_id;

    // Stores user_id between sessions
    localStorage.setItem("user_id", new_user_id);
    user_id = new_user_id;
}

let user_id: UserId | null = localStorage.getItem("user_id");
// If no user id is stored, request new
if (user_id === null) {
    await get_new_user_id();
} else {}

const tickets_list_response = await fetch_with_user_id(`/api/get_tickets`);
const ticket_list: Array<Ticket> = await tickets_list_response.json();
console.log(ticket_list);

for (const event of event_list) {
    append_event_card(event, is_host);
}

for (const ticket of ticket_list) {
    append_ticket_card(ticket.ticket_id);
}
