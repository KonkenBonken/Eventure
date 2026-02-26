import express, {type Request, type Response} from 'express';
import {join as join_path} from 'path';
import {ip as local_ip_address} from "address";
import {imageSync as create_qr_code} from 'qr-image';

import {get_ticket, get_tickets_for_user, make_ticket} from "./lib/ticket.js";
import {get_all_events, get_event} from "./lib/event.js";
import {authentication, type User} from "./lib/users.js";

const app = express();
const port = 80;

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

const current_directory = import.meta.dirname;
const frontend_directory = join_path(current_directory, '../frontend');
const serve_file = (filename: string) => (req: Request, res: Response): void =>
    res.sendFile(join_path(frontend_directory, filename));

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

// Appends the user property to the global Request type
declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}

// Intercepts every /api/* route and checks authentication
// In each api route handler after, a User record is present on the Request
app.use('/api', (req, res, next) => {
    const [username, password] = req.headers.authorization?.split(':') ?? [];

    if (username === undefined || password === undefined) {
        res.sendStatus(401);
    } else {
        const user = authentication(username, password);
        if (user === false) {
            res.sendStatus(401);
        } else {
            req.user = user;
            next();
        }
    }
});

app.get('/api/events', (req, res) => res.json(get_all_events()));

app.get('/api/book/:event_id', (req, res) => {
    const {event_id} = req.params;
    const event = get_event(event_id);
    const {username} = req.user;
    // If event is not found, respond with status 404 (Not Found)
    if (event === null) {
        res.status(404).send('Event not found');
    } else {
        const ticket = make_ticket(event_id, username);
        if (ticket !== false) {
            // Tickets are still available
            res.send(ticket.ticket_id);
        } else {
            // If event is sold out, respond with status 409 (Conflict)
            res.status(409).send('Sorry, tickets are sold out');
        }
    }
});

app.get('/api/get_tickets', (req, res) => {
    const {username} = req.user;
    res.json(get_tickets_for_user(username));
});

app.listen(port, () => console.log('Listening on http://' + local_ip_address()));
