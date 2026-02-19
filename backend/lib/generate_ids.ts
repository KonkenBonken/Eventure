import {type TicketId} from './ticket.js';

/** A ticket id consists of a six character long string consisting of characters a-z and 0-9 */
export type TicketId = string;

export function generate_new_ticket_id(): TicketId {
    // We generate a random number between 0 and 36⁶-1 and then return it as a six character long string in base 36
    return Math.floor(Math.random() * 36 ** 6).toString(36).padStart(6, '0');
    // TODO: Also check for duplicates
}

export function hash_function(k: TicketId): number {
    return parseInt(k, 36);
}