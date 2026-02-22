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

export function get_ticket(ticket_id: TicketId): Ticket | null {
    return lookup_id(tickets, ticket_id);
}

export function make_ticket(event_id: EventId, user_id: UserId): Ticket {
// Generate id, create ticket, store ticket in Tickets and return Ticket
    const ticket_id = generate_new_id(tickets);
    const current_ticket = {event_id, ticket_id, user_id};
    // adding ticket to tickets:
    ph_insert<TicketId, Ticket>(tickets, ticket_id, current_ticket);
    return current_ticket;
}

export function get_tickets_for_user(user_id: UserId) {
    return tickets.values.filter(ticket =>
        ticket !== undefined
        && ticket.user_id === user_id
    ) as Array<Ticket>;
}
