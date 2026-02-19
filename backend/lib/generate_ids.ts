import { ph_lookup } from "./pkd/hashtables.js";
import { tickets, Ticket } from "./ticket.js";

/** A ticket id consists of a six character long string consisting of characters a-z and 0-9 */
export type TicketId = string;

export function generate_new_ticket_id(): TicketId {
    // We generate a random number between 0 and 36⁶-1 and then return it as a six character long string in base 36
    const id = Math.floor(Math.random() * 36 ** 6).toString(36).padStart(6, '0');
    
    // Check for duplicates
    const is_unique = ph_lookup<TicketId, Ticket>(tickets, id);
    if (is_unique === undefined) {
        return id;
    }
    // else generate a new id
    return generate_new_ticket_id();
}

export function hash_function(k: TicketId): number {
    return parseInt(k, 36);
}