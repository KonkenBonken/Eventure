import {ph_insert, type ProbingHashtable} from './pkd/hashtables.js';
import {type EventId, lookup_id, make_ht} from './generate_ids.js';

// A string representing a ISO timestamp
type Timestamp = string;

export interface Event {
    event_id: EventId;
    title: string;
    description: string;
    timestamp: Timestamp;
    price: number;
}


//empty probing hashtable with 100 slots
const events: ProbingHashtable<EventId, Event> = make_ht();


//Returns an Array with all the Event records
export function get_all_events(): Array<Event> {
    const events_array: Array<Event> = [];

    for (let index = 0; index < 100; index++) {
        const pos_entry = events.values[index];

        //check its not an empty or deleted spot
        if (pos_entry !== undefined && pos_entry !== null) {
            events_array.push(pos_entry);
        } else {}
    }
    return events_array;
}

//Gets event record if found in hashtable events, else returns null
export function get_event(event_id: EventId): Event | null {
    return lookup_id(events, event_id);
}

//Turns a ISO date string to a Date
export function get_date(Event: Event): Date {
    return new Date(Event.timestamp);
}

//hardcoded examples
const event_ex1: Event = {
    event_id: "123456",
    title: "Hot chocochug",
    description: "Drink a liter of hot chocolate challenge, hot chocolate provided",
    timestamp: new Date(2026, 1, 25).toJSON(),
    price: 40,
}
const event_ex2: Event = {
    event_id: "789abc",
    title: "Bee hive building",
    description: "Come build some beehives for spring!",
    timestamp: new Date(2026, 3, 20).toJSON(),
    price: 10,
}
const event_ex3: Event = {
    event_id: "defghi",
    title: "Beverage ball",
    description: "Dance around in outfits inspired by your favorite drink!",
    timestamp: new Date(2026, 2, 3).toJSON(),
    price: 150,
}
//add examples to events hashtable
ph_insert(events, event_ex1.event_id, event_ex1);
ph_insert(events, event_ex2.event_id, event_ex2);
ph_insert(events, event_ex3.event_id, event_ex3);

