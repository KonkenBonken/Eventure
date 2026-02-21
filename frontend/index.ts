import type {Event} from "../backend/lib/event.js";
import {TicketId, UserId} from "../backend/lib/generate_ids.js";

function create_event_card(event: Event): HTMLElement {
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
        const ticket_response = await fetch(`/api/book/${event.event_id}/${user_id}`);
        const ticket_id: TicketId = await ticket_response.text();
        const ticket_element = document.createElement("p");
        ticket_element.innerHTML = `Your ticket id: <code>${ticket_id}</code>`;
        card.append(ticket_element);
    });

    return card;
}

const event_list_response = await fetch('/api/events');
const event_list: Array<Event> = await event_list_response.json();
console.log(event_list);

// User gets a unique code to use when booking a ticket
const user_id_response = await fetch('/api/get_new_user_id');
const user_id: UserId = await user_id_response.text();

for (const event of event_list) {
    document.body.append(create_event_card(event));
}