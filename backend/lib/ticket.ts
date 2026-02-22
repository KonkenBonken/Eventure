import {ph_insert, ProbingHashtable} from './pkd/hashtables.js';
import {
    type EventId, generate_new_id, lookup_id, make_ht, type TicketId,
    type UserId
} from "./generate_ids.js";

export interface Ticket {
    event_id: EventId,
    ticket_id: TicketId,
    user_id: UserId
}

export const tickets: ProbingHashtable<TicketId, Ticket> = make_ht();

/**
 * Gets the ticket from an id
 * @param ticket_id The id of the ticket
 * @returns The ticket record if found, else returns null
 */
export function get_ticket(ticket_id: TicketId): Ticket | null {
    return lookup_id(tickets, ticket_id);
}

/**
 * Creates a ticket record and stores it in the tickets table
 * @param event_id The id of the event
 * @param user_id The id of the user
 * @returns The created ticket record
 */
export function make_ticket(event_id: EventId, user_id: UserId): Ticket {
    const ticket_id = generate_new_id(tickets);
    const current_ticket = {event_id, ticket_id, user_id};
    // adding ticket to tickets:
    ph_insert<TicketId, Ticket>(tickets, ticket_id, current_ticket);
    return current_ticket;
}

/**
 * Gets all tickets for a user
 * @param user_id The id of the user
 * @complexity Θ(n)
 * @returns An array of tickets
 */
export function get_tickets_for_user(user_id: UserId): Array<Ticket> {
    return tickets.values.filter(ticket =>
        ticket !== undefined
        && ticket.user_id === user_id
    ) as Array<Ticket>;
}
