import type {Event} from "../backend/lib/event.js";
import {UserId} from "../backend/lib/generate_ids.js";

function create_event_card(event: Event): HTMLElement {
    const card = document.createElement("div");
    card.classList.add("event");
    card.innerHTML = `
        <h2>${event.title}</h2>
        <p>${event.description}</p>
        <p>${event.price}:-</p>
        <hr>
    `;
    return card;
}

const event_list_response = await fetch('/api/events');
const event_list: Array<Event> = await event_list_response.json();
console.log(event_list);

for (const event of event_list) {
    document.body.append(create_event_card(event));
}

// User gets a unique code to use when booking a ticket
const user_id_response = await fetch('/api/get_new_user_id');
const user_id: UserId = await user_id_response.text();

// Show the user their ticket
