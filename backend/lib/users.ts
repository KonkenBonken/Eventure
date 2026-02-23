import {ph_insert} from './pkd/hashtables.js';
import {make_table, lookup_id, generate_new_id, type UserId} from "./generate_ids.js";

export interface User {
    user_id: UserId
}

// Table to store users in
const users = make_table<User>();

/**
 * Gets the user from an id
 * @param user_id The id of the user
 * @returns The user record if found, else returns null
 */
export function get_user(user_id: UserId): User | null {
    return lookup_id(users, user_id);
}

/**
 * Checks if a user exists in the users table
 * @param user_id The id of the user
 * @returns true if the user exists, else returns false
 */
export function user_exists(user_id: UserId): boolean {
    return get_user(user_id) !== null;
}

/**
 * Creates a user record and stores it in the users table
 * @returns The created user record
 */
export function make_user(): User {
    const user_id = generate_new_id(users);
    const new_user = {user_id};
    // adding user to users:
    ph_insert(users, user_id, new_user);
    return new_user;
}
