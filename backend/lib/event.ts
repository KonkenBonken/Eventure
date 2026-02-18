import {type ProbingHashtable} from './pkd/hashtables.js';

export type EventId = string;

export interface Event {
    event_id: EventId,
    title: string,
    description: string,
    timestamp: Date,
    price: number,
}

const events: ProbingHashtable<EventId, Event>;

export function get_all_events(): Array<Event> {
    // Get all events and return as array
    // Note that the type `Date` need to be serialised before sending to the client
}

export function get_event(event_id: EventId): Event | null {
}
