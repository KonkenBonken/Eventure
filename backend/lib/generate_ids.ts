import { ph_lookup, ph_empty, type ProbingHashtable } from "./pkd/hashtables.js";

/** An event id consists of a six character long string consisting of characters a-z and 0-9 */
export type EventId = string;

/** A ticket id consists of a six character long string consisting of characters a-z and 0-9 */
export type TicketId = string;

/** A user id consists of a six character long string consisting of characters a-z and 0-9 */
export type UserId = string;

export function hash_function(k: TicketId | EventId): number {
    return parseInt(k, 36);
}

// ABSTRACTIONS
// Makes an empty probing hashtable with size 100
export function make_ht<V> (): ProbingHashtable<string,V> {
	return ph_empty<string, V>(100, hash_function);
}

// Checks if id is in hashtable and returns the value stored at that key if exsisting
export function lookup_id<V>(ht: ProbingHashtable<string, V>, id: string): V | null {
	const lookup = ph_lookup(ht, id);
	if (lookup === undefined) {
		return null;
	}
	return lookup;
}

// Generates a new unique id
export function generate_new_id<V>(ht: ProbingHashtable<string, V>): string {
	// We generate a random number between 0 and 36⁶-1 and then return it as a six character long string in base 36
	const id = Math.floor(Math.random() * 36 ** 6).toString(36).padStart(6, '0');
	// Check for duplicates, if id is unique then return id, otherwise generate a new one
	const is_unique = ph_lookup(ht, id);
	if (is_unique === undefined) {
        return id;
    }
    return generate_new_id(ht);
}
