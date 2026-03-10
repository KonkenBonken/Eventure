import {ph_insert} from './pkd/hashtables.js';
import {
    type EventId, generate_new_id, lookup_id, make_table
} from './table.js';
import {type User} from "./users.js";

// A string representing a ISO timestamp
type Timestamp = string;

export interface Event {
    event_id: EventId,
    host_username: string,
    title: string,
    description: string,
    timestamp: Timestamp,
    price: number,
    capacity: number | undefined,
    sold_tickets: number
}


// Table to store events in
const events = make_table<Event>();


/**
 * Returns an Array with all the stored Event records
 * @complexity Θ(n)
 * @returns An Array of all events
 */
export function get_all_events(user: User): Array<Event> {
    const events_array: Array<Event> = [];

    for (let index = 0; index < 100; index++) {
        const pos_entry = events.values[index];

        if (
            // Ensure it's not an empty spot
            pos_entry !== undefined
            // Ensure hosts only see their events
            && (!user.is_host || user.username === pos_entry.host_username)
        ) {
            events_array.push(pos_entry);
        } else {}
    }
    return events_array;
}

/**
 * Gets the event from an id
 * @param event_id The id of the event
 * @returns The event record if found, else returns null
 */
export function get_event(event_id: EventId): Event | null {
    return lookup_id(events, event_id);
}

/**
 * Creates an event record and stores it in the events table
 * @returns The created event record
 */
export function make_event(data: Omit<Event, 'event_id'>): Event {
    const event_id = generate_new_id(events);
    const new_event = {...data, event_id};
    // adding event to events:
    ph_insert(events, event_id, new_event);
    return new_event;
}

/**
 * Increments the number of sold tickets for given event
 * @param event The event
 * @precondition The event exists and is not sold out
 */
export function increment_sold_tickets(event: Event): void {
    // add one to event.sold_tickets
    event.sold_tickets++;
}

/**
 * Checks if event is sold out
 * @param event the event
 * @precondition The event exists
 * @returns True if event is sold out and
 *          false if tickets are still available
 */
export function is_sold_out(event: Event): boolean {
    // checks if the event capacity is defined and sold out
    return event.capacity !== undefined && event.sold_tickets >= event.capacity;
}


// add hardcoded examples to the events table
make_event({
    host_username: 'host',
    title: "Hot chocochug",
    description: "Drink a liter of hot chocolate challenge, hot chocolate provided",
    timestamp: new Date(2026, 1, 25, 17, 0).toJSON(),
    price: 40,
    capacity: undefined,
    sold_tickets: 3,
});

make_event({
    host_username: 'host',
    title: "Bee hive building",
    description: "Come build some beehives for spring!",
    timestamp: new Date(2026, 3, 20, 15, 15).toJSON(),
    price: 10,
    capacity: 15,
    sold_tickets: 15,
});

make_event({
    host_username: 'host',
    title: "Beverage ball",
    description: "Dance around in outfits inspired by your favorite drink!",
    timestamp: new Date(2026, 2, 3, 18, 30).toJSON(),
    price: 150,
    capacity: 150,
    sold_tickets: 148,
});

