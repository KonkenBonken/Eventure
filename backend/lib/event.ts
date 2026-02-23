import { ph_insert } from './pkd/hashtables.js';
import {type EventId, generate_new_id, lookup_id, make_ht} from './generate_ids.js';

// A string representing a ISO timestamp
type Timestamp = string;

export interface Event {
    event_id: EventId,
    title: string,
    description: string,
    timestamp: Timestamp,
    price: number
}


//empty probing hashtable with 100 slots
const events = make_ht<Event>();


//Returns an Array with all the Event records
export function get_all_events(): Array<Event> {
    const eventsArray: Array<Event> = [];

    for (let index = 0; index < 100; index++) {
        const pos_entry = events.values[index];

        //check its not an empty or deleted spot
        if (pos_entry !== undefined && pos_entry !== null) {
            eventsArray.push(pos_entry);
        }
    }
    return eventsArray;
}

//Gets event record if found in hashtable events, else returns null
export function get_event(event_id: EventId): Event | null {
    return lookup_id(events, event_id);
}

//Turns a ISO date string to a Date
export function get_date(Event: Event): Date {
    return new Date(Event.timestamp);
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

// add hardcoded examples to the events table
make_event({
    title: "Hot chocochug",
    description: "Drink a liter of hot chocolate challenge, hot chocolate provided",
    timestamp: new Date(2026, 1, 25).toJSON(),
    price: 40,
});

make_event({
    title: "Bee hive building",
    description: "Come build some beehives for spring!",
    timestamp: new Date(2026, 3, 20).toJSON(),
    price: 10,
});

make_event({
    title: "Beverage ball",
    description: "Dance around in outfits inspired by your favorite drink!",
    timestamp: new Date(2026, 2, 3).toJSON(),
    price: 150,
});

