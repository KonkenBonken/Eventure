import express, {type Request, type Response} from 'express';
import {join as join_path} from 'path';
import {ip as local_ip_address} from "address";
import {imageSync as create_qr_code} from 'qr-image';

import {get_ticket, get_tickets_for_user, make_ticket} from "./lib/ticket.js";
import {get_all_events, get_event, make_event} from "./lib/event.js";
import {make_user, user_exists} from "./lib/users.js";

const app = express();
const port = 80;

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const current_directory = import.meta.dirname;
const frontend_directory = join_path(current_directory, '../frontend');
const serve_file = (filename: string) => (req: Request, res: Response): void =>
    res.sendFile(join_path(frontend_directory, filename));

app.get('/', serve_file('index.html'));
app.get('/index.js', serve_file('index.js'));

// host
app.get('/host', serve_file('host.html'));

app.post('/host', (req, res) => {
    const data = req.body;
    // Make event
    const new_event = make_event({
        title: data.title,
        description: data.description,
        timestamp: data.timestamp,
        price: data.price,
        capacity: data.capacity === "" ? undefined : data.capacity,
        sold_tickets: 0,
    });
    res.redirect('/host');
});

// user
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

app.get('/ticket_qr_code/:ticket_id', (req, res) => {
    const {ticket_id} = req.params;
    const ticket = get_ticket(ticket_id);
    if (ticket === null) {
        // Handle ticket not found
        res.status(404).send('Ticket not found');
    } else {
        res.header('Content-Type', 'image/svg+xml').send(
            create_qr_code(`http://${local_ip_address()}/validate/${ticket_id}`, {ec_level: 'L', type: 'svg'})
        );
    }
});

app.get('/api/get_new_user_id', (req, res) => {
    res.json(make_user());
});

app.get('/api/events', (req, res) => res.json(get_all_events()));

app.get('/api/book/:event_id/:user_id', (req, res) => {
    const {event_id, user_id} = req.params;
    const event = get_event(event_id);
    // If event is not found, respond with status 404 (Not Found)
    if (event === null) {
        res.status(404).send('Event not found');
    }
    // If non-existent user id, respond with status 401 (Unauthorized)
    else if (!user_exists(user_id)) {
        res.status(401).send('Invalid user ID')
    } else {
        const ticket = make_ticket(event_id, user_id);
        if (ticket !== false) {
            // Tickets are still available
            res.send(ticket.ticket_id);
        } else {
            // If event is sold out, respond with status 409 (Conflict)
            res.status(409).send('Sorry, tickets are sold out');
        }
    }
});

app.get('/api/get_tickets/:user_id', (req, res) => {
    const {user_id} = req.params;
    // If non-existent user id, respond with status 401 (Unauthorized)
    if (!user_exists(user_id)) {
        res.status(401).send('Invalid user ID')
    } else {
        res.json(get_tickets_for_user(user_id));
    }
});

app.listen(port, () => console.log('Listening on http://' + local_ip_address()));
