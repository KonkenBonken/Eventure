import express, {type Request, type Response} from 'express';
import {join as join_path} from 'path';
import {ip as local_ip_address} from "address";

import {get_ticket, make_ticket} from "./lib/ticket.js";
import {get_all_events, get_event} from "./lib/event.js";

const app = express();
const port = 80;

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

const current_directory = import.meta.dirname;
const frontend_directory = join_path(current_directory, '../frontend');
const serve_file = (filename: string) =>
    (req: Request, res: Response) => res.sendFile(join_path(frontend_directory, filename));

app.get('/', serve_file('index.html'));
app.get('/index.js', serve_file('index.js'));

app.get('/validate/:ticket_id', (req, res) => {
    const {ticket_id} = req.params;
    const ticket = get_ticket(ticket_id);
    if (ticket === null) {
        // Handle ticket not found
        res.status(404).send('Ticket not found');
    } else {
        const event = get_event(ticket.event_id);
        // Handle event not found
        event === null
            ? res.status(404).send('Event not found')
            : res.send(`Ticket valid for event: ${event.title}`);
    }
});

app.get('/api/events', (req, res) => res.json(get_all_events()));

app.get('/api/book/:event_id', (req, res) => {
    const {event_id} = req.params;
    const event = get_event(event_id);
    // If event is not found, respond with status 404 (Not Found)
    event === null
        ? res.status(404).send('Event not found')
        : res.send(make_ticket(event_id).ticket_id);
});

app.listen(port, () => console.log('Listening on http://' + local_ip_address()));
