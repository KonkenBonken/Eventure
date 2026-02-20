import {type ProbingHashtable} from './pkd/hashtables.js';
import { ph_empty,  ph_lookup, ph_insert } from './pkd/hashtables.js';
import { hash_function } from './generate_ids.js';

export type EventId = string;

export interface Event {
    event_id: EventId;
    title: string;
    description: string;
    timestamp: string;
    price: number;
}


//empty probing hashtable with 100 slots
const events: ProbingHashtable<EventId, Event> = ph_empty(100, hash_function);


//Returns an Array with all the Event records
export function get_all_events(): Array<Event> {
    const eventsArray: Array<Event> = [];

    for (let index = 0; index < 100; index++) {
        
        const pos_entry = events.values[index];


        //check its not an ampty or deleted spot
        if (pos_entry !== undefined && pos_entry !== null) {
        eventsArray.push(pos_entry);
        }

        
    }

    return eventsArray;
}


//Gets event record if Id is found in hashtable events, else returns null
export function get_event(event_id: EventId): Event | null {
    const found_event = ph_lookup(events, event_id)
    if (found_event === undefined) {
        return null;
    } else {
        return found_event;
    }
}

//GTurns the JSOM string back to a date 
export function get_date(Event: Event): Date {
    return new Date(Event.timestamp);


}
//hardcoded examples
const event_ex1: Event = {
    event_id: "123456",
    title: "Hot chocochug",
    description: "Drink a liter of hot chocolate challange, hot chocolate provided",
    timestamp: new Date(2026, 1, 25).toJSON(),
    price: 40,
}
const event_ex2: Event = {
    event_id: "123",
    title: "Bee hive building",
    description: "Come build some beehives for spring!",
    timestamp: new Date(2026, 3, 20).toJSON(),
    price: 10,
}
const event_ex3: Event = {
    event_id: "456",
    title: "Beverage ball",
    description: "Dance around in outfits inspired by your favorite drink!",
    timestamp: new Date(2026, 2, 3).toJSON(),
    price: 150,
}
//add examples to events hashtable
ph_insert(events, "123456", event_ex1);
ph_insert(events, "123", event_ex2);
ph_insert(events, "456", event_ex3);

