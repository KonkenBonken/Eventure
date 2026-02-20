import {ph_empty, ph_insert, ph_lookup} from './pkd/hashtables.js';
import {hash_function, generate_new_ticket_id, type TicketId, type EventId} from "./generate_ids.js";

export interface Ticket {
    event_id: EventId,
    ticket_id: TicketId
}

export const tickets = ph_empty<TicketId, Ticket>(100, hash_function);

export function get_ticket(ticket_id: TicketId): Ticket | null {
    const find_ticket = ph_lookup<TicketId, Ticket>(tickets, ticket_id);
    if(find_ticket === undefined) {
        return null;
    }
    return find_ticket;
}

export function make_ticket(event_id: EventId): Ticket {
// Generate id, create ticket, store ticket in Tickets and return Ticket
    const ticket_id = generate_new_ticket_id();
    const current_ticket = {event_id, ticket_id};
    // adding ticket to tickets:
    ph_insert<TicketId, Ticket>(tickets, ticket_id, current_ticket);
    return current_ticket;
}
