import express, {type Request, type Response} from 'express';
import {join as join_path} from 'path';
import {ip as local_ip_address} from "address";

import {get_ticket, get_tickets_for_user, make_ticket} from "./lib/ticket.js";
import {get_all_events, get_event} from "./lib/event.js";
import {generate_user_id, is_user} from "./lib/generate_ids.js";

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

app.get('/api/get_new_user_id', (req, res) => {
    const user_id = generate_user_id;
    res.send(user_id);
});

app.get('/api/events', (req, res) => res.json(get_all_events()));

app.get('/api/book/:event_id/:user_id', (req, res) => {
    const {event_id} = req.params;
    const event = get_event(event_id);
    const {user_id} = req.params;
    // If event is not found, respond with status 404 (Not Found)
    if (event === null) {
        return res.status(404).send('Event not found');
    }
    // If non existent user id is used to book a ticket, respond with status 401 (Unauthorized)
    if (is_user === null) {
        return res.status(401).send('Invalid user ID')
    }
    res.send(make_ticket(event_id, user_id).ticket_id);
});

app.get('/api/get_tickets/:user_id', (req, res) => {
    const {user_id} = req.params;
    // If non existent user id, respond with status 401 (Unauthorized)
    if (is_user === null) {
        return res.status(401).send('Invalid user ID')
    }
    res.json(get_tickets_for_user(user_id));
});

app.listen(port, () => console.log('Listening on http://' + local_ip_address()));
