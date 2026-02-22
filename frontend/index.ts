import type {Event} from "../backend/lib/event.js";
import {TicketId, UserId} from "../backend/lib/generate_ids.js";
import {Ticket} from "../backend/lib/ticket.js";

const eventsSection = document.querySelector("#events");
const ticketsSection = document.querySelector("#tickets");

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
        let ticket_response = await fetch(`/api/book/${event.event_id}/${user_id}`);
        // If expired user id, request new and retry
        if (ticket_response.status === 401) {
            await get_new_user_id();
            ticket_response = await fetch(`/api/book/${event.event_id}/${user_id}`);
        } else {}
        const ticket_id: TicketId = await ticket_response.text();
        append_ticket_card(ticket_id);
    });

    eventsSection?.append(card);
}

function append_ticket_card(ticket_id: TicketId): void {
    const card = document.createElement("p");
    card.classList.add("ticket");
    card.innerHTML = `Ticket id: <code>${ticket_id}</code>`;

    ticketsSection?.append(card);
}

const event_list_response = await fetch('/api/events');
const event_list: Array<Event> = await event_list_response.json();
console.log(event_list);

async function get_new_user_id() {
    // Request new user id
    const user_id_response = await fetch('/api/get_new_user_id');
    const new_user_id: UserId = await user_id_response.text();

    // Stores user_id between sessions
    localStorage.setItem("user_id", new_user_id);
    user_id = new_user_id;
}

let user_id: UserId | null = localStorage.getItem("user_id");
// If no user id is stored, request new
if (user_id === null) {
    await get_new_user_id();
} else {}

let tickets_list_response = await fetch(`/api/get_tickets/${user_id}`);
// If expired user id, request new and retry
if (tickets_list_response.status === 401) {
    await get_new_user_id();
    tickets_list_response = await fetch(`/api/get_tickets/${user_id}`);
} else {}

const ticket_list: Array<Ticket> = await tickets_list_response.json();
console.log(ticket_list);

for (const event of event_list) {
    append_event_card(event);
}

for (const ticket of ticket_list) {
    append_ticket_card(ticket.ticket_id);
}
