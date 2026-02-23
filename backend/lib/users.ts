import {ph_insert} from './pkd/hashtables.js';
import {make_ht, lookup_id, generate_new_id, type UserId} from "./generate_ids.js";

export interface User {
    user_id: UserId
}

// Probing hashtable to store user id's
export const users = make_ht<User>();

// Gets user information if user exisisits in hashtable, otherwise null is returned
export function is_user(user_id: UserId): User | null {
    return lookup_id(users, user_id);
}

// Generates user id's and stores them in the hashtable
export function generate_user_id(): User {
    const user_id = generate_new_id(users);
    const current_user = {user_id};
    // adding ticket to tickets:
    ph_insert<UserId, User>(users, user_id, current_user);
    return current_user;
}
