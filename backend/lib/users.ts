import {ph_insert} from './pkd/hashtables.js';
import {make_table, lookup_id} from "./table.js";

export interface User {
    username: string,
    password: string,
    is_host: boolean,
}

// Table to store users in
const users = make_table<User>();

/**
 * Gets the user record of a username
 * @param username The username of the user
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
 * Authenticates a username and password,
 * if user is not found or password does not match, return false
 * @param username The provided username
 * @param password The provided password
 * @returns the user record if the user exists and password matches, else returns false
 */
export function authentication(username: string, password: string): User | false {
    const user = get_user(username);
    return (user !== null && user.password === password)
        ? user
        : false;
}

/**
 * Creates a user record and stores it in the users table
 * @returns The created user record if successful, else returns false
 */
export function make_user(username: string, password: string, is_host: boolean): User | false {
    const new_user = {username, password, is_host};
    if (user_exists(username)) {
        return false;
    } else {
        // adding user to users:
        ph_insert(users, username, new_user);
        return new_user;
    }
}

// Create dummy user for testing
make_user('user', 'pass', false);
make_user('host', 'pass2', true);
