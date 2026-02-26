import type {Event} from "../backend/lib/event.js";
import {TicketId} from "../backend/lib/generate_ids.js";
import {Ticket} from "../backend/lib/ticket.js";

const eventsSection = document.querySelector("#events");
const ticketsSection = document.querySelector("#tickets");

// A string of `{username}:{password}`, or undefined
let credentials: string | undefined;

/**
 * Prompts the user to type in username and password and updates
 * the credentials variable. Retries if provided username is empty.
 */
function login_prompt(): void {
    // TODO: Disallow colon ":" in username
    let _username: string | undefined;
    while (!_username) {
        _username = prompt('What is your username?')?.trim();
    }
    const username: string = _username;
    const password: string = prompt('What is your password?')?.trim() || '';
    credentials = `${username}:${password}`;
}

/**
 * Appends username to the url and fetches the resource,
 * if the server responds with status 401 (Unauthorized),
 * signs up with username and then retries the fetch. Only retries once
 * @param url The base url, excluding `/{username}`
 */
async function fetch_with_auth(url: string): Promise<Response> {
    while (credentials === undefined) {
        login_prompt();
    }

    const response = await fetch(url,
        {headers: {Authorization: credentials}});
    // If unauthorized, invalidate credentials and retry
    if (response.status === 401) {
        credentials = undefined;
        return fetch_with_auth(url);
    } else {
        return response;
    }
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
