import type {Event} from "../backend/lib/event.js";
import {TicketId} from "../backend/lib/generate_ids.js";
import {Ticket} from "../backend/lib/ticket.js";

const eventsSection = document.querySelector("#events");
const ticketsSection = document.querySelector("#tickets");

/**
 * Fetches the resource, if the server responds with status 401 (Unauthorized),
 * redirects to login page
 * @param url The url to fetch
 */
async function fetch_with_auth(url: string): Promise<Response> {
    const response = await fetch(url);
    // If unauthorized, redirect to login page
    if (response.status === 401) {
        location.href = '/login';
    } else {}
    return response;
}

/**
 * Creates an event card and appends it to the Events section
 * @param event The event
 */
function append_event_card(event: Event): void {
    const card = document.createElement("div");
    card.classList.add("event");
    card.innerHTML = `
        <hr>
        <h2>${event.title}</h2>
        <p>${event.description}</p>
        <p>${event.price}:-</p>
        <button>Book</button>
    `;

    card.querySelector('button')?.addEventListener('click', async () => {
        const ticket_response = await fetch_with_auth(`/api/book/${event.event_id}`);
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

const event_list_response = await fetch_with_auth('/api/events');
const event_list: Array<Event> = await event_list_response.json();
console.log(event_list);

const tickets_list_response = await fetch_with_auth(`/api/get_tickets`);
const ticket_list: Array<Ticket> = await tickets_list_response.json();
console.log(ticket_list);

for (const event of event_list) {
    append_event_card(event);
}

for (const ticket of ticket_list) {
    append_ticket_card(ticket.ticket_id);
}
