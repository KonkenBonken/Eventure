import {ph_insert} from './pkd/hashtables.js';
import {
    type EventId, generate_new_id, lookup_id, make_table, type TicketId
} from "./table.js";
import {type User} from "./users.js";
import {get_event, is_sold_out, increment_sold_tickets} from "./event.js";

export interface Ticket {
    event_id: EventId,
    ticket_id: TicketId,
    username: string
}

// Table to store tickets in
const tickets = make_table<Ticket>();

/**
 * Gets the ticket from an id
 * @param ticket_id The id of the ticket
 * @returns The ticket record if found, else returns null
 */
export function get_ticket(ticket_id: TicketId): Ticket | null {
    return lookup_id(tickets, ticket_id);
}

/**
 * Checks if user already has a ticket for event
 * @param event_id The id of the event
 * @param username The username of the user
 * @returns True if the user has a ticket for the event, else returns false
 */
export function user_has_ticket(event_id: EventId, username: string): boolean {
    // Checks for the event_id in all the users tickets
    const users_tickets = get_tickets_for_user(username);
    return users_tickets.some(ticket => ticket.event_id === event_id);
}

/**
 * Creates a ticket record and stores it in the tickets table
 * @param event_id The id of the event
 * @param user The user record
 * @returns The created ticket record if successfully booked,
 *          if not, returns a string containing the reason of the error
 */
export function make_ticket(event_id: EventId, user: User): Ticket | string {
    const {username} = user;
    const event = get_event(event_id);
    if (event === null) {
        return 'Event not found';
    } else if (user.is_host) {
        return 'Hosts cannot buy tickets';
    } else if (is_sold_out(event)) {
        return `Sorry, ${event.title} is sold out`;
    } else if (user_has_ticket(event_id, username)) {
        return `Sorry, you already have a ticket for ${event.title}`;
    } else {
        const ticket_id = generate_new_id(tickets);
        const new_ticket = {event_id, ticket_id, username};
        // Adding ticket to tickets
        increment_sold_tickets(event);
        ph_insert(tickets, ticket_id, new_ticket);
        return new_ticket;
    }
}


/**
 * Gets all tickets for a user
 * @param username The username of the user
 * @complexity Θ(n)
 * @returns An array of tickets
 */
export function get_tickets_for_user(username: string): Array<Ticket> {
    return tickets.values.filter(ticket =>
        ticket !== undefined
        && ticket.username === username
    ) as Array<Ticket>;
}
