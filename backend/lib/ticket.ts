import {ph_insert} from './pkd/hashtables.js';
import {
    type EventId, generate_new_id, lookup_id, make_table, type TicketId
} from "./generate_ids.js";
import {get_event, is_sold_out, ticket_count} from "./event.js";

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
 * @param user_id The id of the user
 * @returns true if the user has a ticket for the event and false if they dont.
 */
export function Already_has_ticket_check(event_id: EventId, username: string): true | false {
    
    //checks for the eventId in all the users tickets 
    function check_for_ticket(event_id: EventId, username: string): boolean {
        const users_tickets = get_tickets_for_user(username);

        return users_tickets.some(ticket => ticket.event_id === event_id);
    }
    
    if (check_for_ticket(event_id, username)) {
        return true
    } else {
        return false
    }
}

/**
 * Creates a ticket record and stores it in the tickets table
 * @param event_id The id of the event
 * @param username The username of the user
 * @returns The created ticket record if successfully booked,
 *          if user already has a ticket for the event,
 *          event is not found or is sold out, returns false
 */
export function make_ticket(event_id: EventId, username: string): Ticket | false {
    const event = get_event(event_id);
    // If event is not found or is sold out, return false
    if (event === null || is_sold_out(event) || Already_has_ticket_check(event_id, username)) {
        return false;
    }

    const ticket_id = generate_new_id(tickets);
    const new_ticket = {event_id, ticket_id, username};
    // adding ticket to tickets:
    ticket_count(event);
    ph_insert(tickets, ticket_id, new_ticket);
    return new_ticket;
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
