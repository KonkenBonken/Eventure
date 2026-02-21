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
        let ticket_response = await fetch(`/api/book/${event.event_id}/${user_id}`);
        // If expired user id, request new and retry
        if (ticket_response.status === 401) {
            await get_new_user_id();
            ticket_response = await fetch(`/api/book/${event.event_id}/${user_id}`);
        }
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
}

for (const event of event_list) {
    document.body.append(create_event_card(event));
}