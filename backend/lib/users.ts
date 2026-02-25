import {ph_insert} from './pkd/hashtables.js';
import {make_table, lookup_id} from "./generate_ids.js";

export interface User {
    username: string
}

// Table to store users in
// TODO: Update hash function to handle a larger character set than base 36
const users = make_table<User>();

/**
 * Gets the user from an id
 * @param username The id of the user
 * @returns The user record if found, else returns null
 */
export function get_user(username: string): User | null {
    return lookup_id(users, username);
}

/**
 * Checks if a user exists in the users table
 * @param username The username of the user
 * @returns true if the user exists, else returns false
 */
export function user_exists(username: string): boolean {
    return get_user(username) !== null;
}

/**
 * Creates a user record and stores it in the users table
 * @returns The created user record
 */
export function make_user(username: string): User {
    const new_user = {username};
    // adding user to users:
    ph_insert(users, username, new_user);
    return new_user;
}
