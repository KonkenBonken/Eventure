import {type ProbingHashtable} from './pkd/hashtables.js';
import {type EventId} from './event.js';

export type TicketId = string;

export interface Ticket {
    event_id: EventId,
    ticket_id: TicketId
}

const tickets: ProbingHashtable<TicketId, Ticket>;

export function get_ticket(ticket_id: TicketId): Ticket | null {
}

export function make_ticket(event_id: EventId): Ticket {
// Generate id, create ticket, store ticket in Tickets and return Ticket
}
