import {ph_empty} from './pkd/hashtables.js';
import {type EventId} from './event.js';
import {hash_function, type TicketId} from "./generate_ids.js";

export interface Ticket {
    event_id: EventId,
    ticket_id: TicketId
}

const tickets = ph_empty<TicketId, Ticket>(100, hash_function);

export function get_ticket(ticket_id: TicketId): Ticket | null {
}

export function make_ticket(event_id: EventId): Ticket {
// Generate id, create ticket, store ticket in Tickets and return Ticket
}
