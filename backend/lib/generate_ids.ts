import { ph_lookup } from "./pkd/hashtables.js";
import { tickets, Ticket } from "./ticket.js";

/** An event id consists of a six character long string consisting of characters a-z and 0-9 */
export type EventId = string;

/** A ticket id consists of a six character long string consisting of characters a-z and 0-9 */
export type TicketId = string;

/** A user id consists of a six character long string consisting of characters a-z and 0-9 */
export type UserId = string;

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

export function hash_function(k: TicketId | EventId): number {
    return parseInt(k, 36);
}

// because this is a temporary solution for MVP - later hash table would be fitting
export const users: Array<UserId> = [];

export function generate_user_id(): UserId {
    const user_id = Math.floor(Math.random() * 36 ** 6).toString(36).padStart(6, '0');
	if (users.includes(user_id)) {
	 return generate_user_id();
	}
    users.push(user_id);
    return user_id
}