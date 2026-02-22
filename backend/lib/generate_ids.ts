import {ph_empty, ph_lookup, type ProbingHashtable} from "./pkd/hashtables.js";

/** An event id consists of a six character long string consisting of characters a-z and 0-9 */
export type EventId = string;

/** A ticket id consists of a six character long string consisting of characters a-z and 0-9 */
export type TicketId = string;

/** A user id consists of a six character long string consisting of characters a-z and 0-9 */
export type UserId = string;

function hash_function(k: TicketId | EventId): number {
    return parseInt(k, 36);
}

// ABSTRACTIONS
// Makes an empty probing hashtable with size 100
export function make_ht<V>(): ProbingHashtable<string, V> {
    return ph_empty<string, V>(100, hash_function);
}

/**
 * Gets the value of a key in a hashtable
 * @param ht The hash table to search
 * @param id The key to search for
 * @returns The value at the key if found, else returns null
 */
export function lookup_id<V>(ht: ProbingHashtable<string, V>, id: string): V | null {
    const lookup = ph_lookup(ht, id);
    if (lookup === undefined) {
        return null;
    } else {}
    return lookup;
}

/**
 * Generates a new unique id
 * @param ht The hash table to search for collisions in
 * @returns The generated id
 */
export function generate_new_id<V>(ht: ProbingHashtable<string, V>): string {
    // We generate a random number between 0 and 36⁶-1 and then return it as a six character long string in base 36
    const id = Math.floor(Math.random() * 36 ** 6)
        .toString(36).padStart(6, '0');
    // Check for duplicates, if id is unique then return id, otherwise generate a new one
    const is_unique = ph_lookup(ht, id);
    if (is_unique === undefined) {
        return id;
    } else {}
    return generate_new_id(ht);
}


// USER IDs
// Stores users in probing hashtable
export const users: ProbingHashtable<UserId, UserId> = make_ht();

// Generates user id
export function generate_user_id(): UserId {
    return generate_new_id(users);
}

// Checks if user exists
export function is_user(user_id: UserId): UserId | null {
    return lookup_id(users, user_id);
}
