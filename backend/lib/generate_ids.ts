import {haschHex} from 'hasch/string';
import {ph_empty, ph_lookup, type ProbingHashtable} from "./pkd/hashtables.js";

/** An event id consists of a six character long string consisting of characters a-z and 0-9 */
export type Id = string;

export type EventId = Id;
export type TicketId = Id;

function hash_function(k: Id): number {
    // Hashes key and parses hash as integer
    return parseInt(haschHex(k), 16);
}

// ABSTRACTIONS
/**
 * Creates an empty growing table
 * @returns The created table
 */
export function make_table<V>(): ProbingHashtable<Id, V> {
    return ph_empty(10, hash_function);
}

/**
 * Gets the value of a key in a hashtable
 * @param ht The hash table to search
 * @param id The key to search for
 * @returns The value at the key if found, else returns null
 */
export function lookup_id<V>(ht: ProbingHashtable<Id, V>, id: Id): V | null {
    const value = ph_lookup(ht, id);
    return value === undefined ? null : value;
}

/**
 * Generates a new unique id
 * @param ht The hash table to search for collisions in
 * @returns The generated id
 */
export function generate_new_id<V>(ht: ProbingHashtable<Id, V>): Id {
    // We generate a random number between 0 and 36⁶-1 and then return it as a six character long string in base 36
    const id = Math.floor(Math.random() * 36 ** 6)
        .toString(36).padStart(6, '0');
    // Check for duplicates, if id is unique then return id, otherwise generate a new one
    const is_unique = ph_lookup(ht, id) === undefined;
    return is_unique ? id : generate_new_id(ht);
}
