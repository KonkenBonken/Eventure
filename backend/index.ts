import express, {NextFunction, type Request, type Response} from 'express';
import cookieParser from 'cookie-parser';
import {join as join_path} from 'path';
import {ip as local_ip_address} from "address";
import {imageSync as create_qr_code} from 'qr-image';

import {get_ticket, get_tickets_for_user, make_ticket} from "./lib/ticket.js";
import {get_all_events, get_event, make_event} from "./lib/event.js";
import {authentication, get_user, make_user, type User} from "./lib/users.js";

const app = express();
const port = 80;

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

const current_directory = import.meta.dirname;
const frontend_directory = join_path(current_directory, '../frontend');
const serve_file = (filename: string) => (req: Request, res: Response): void =>
    res.sendFile(join_path(frontend_directory, filename));

// Disallowes users from visiting host page and hosts from visiting user page
// by redirecting them to their respective pages
// Redirects unauthorized users to the login page
const role_required = (role: boolean) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const user = authentication(req.cookies.username, req.cookies.password);
        if (!user) {
            res.redirect('/login');   
        } else if (user && user.is_host === role) {
            next();
        } else if (user.is_host === false) {
            res.redirect('/');
        } else {
            res.redirect('/host');
        }
}

app.get('/', role_required(false), serve_file('index.html'));
app.get('/index.js', serve_file('index.js'));
app.get('/index.css', serve_file('index.css'));

// host
app.get('/host', role_required(true), serve_file('host.html'));

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
            create_qr_code(`http://${local_ip_address()}/validate/${ticket_id}`, {
                ec_level: 'L',
                type: 'svg'
            })
        );
    }
});

// login
app.get('/login', serve_file('login.html'));

app.post('/login', (req, res) => {
    const data: Record<string, string> = req.body;

    const username = data.username?.trim();
    const password = data.password;

    if (
        // Ensures that username and password is non-empty
        !username || !password

        // Authenticates username and password
        || !authentication(username, password)
    ) {
        res.sendStatus(401);
    } else {
        const is_host = get_user(username)?.is_host;
        const redirect_path = is_host ? '/host' : '/';

        // If successfully logged, set cookies and redirect to main page
        res.cookie('username', username)
            .cookie('password', password)
            .redirect(redirect_path);
    }
});

app.get('/logout', (req, res) => {
    // Remove cookies and redirect to login page
    res.clearCookie('username')
        .clearCookie('password')
        .redirect('/login');
});

app.post('/signup', (req, res) => {
    const data: Record<string, string> = req.body;

    const username = data.username?.trim();
    const password = data.password;
    const is_host = data.host === 'on';

    if (
        // Ensures that username and password is non-empty
        !username || !password
    ) {
        res.sendStatus(400);
    } else {
        const user = make_user(username, password, is_host);
        if (user === false) {
            res.status(409).send('User already exists');
        } else {
            const redirect_path = user.is_host ? '/host' : '/';
            // If successfully signed up, set cookies and redirect to main page
            res.cookie('username', user.username)
                .cookie('password', user.password)
                .redirect(redirect_path);
        }
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
    const cookies = req.cookies as Record<string, string>;
    const {username, password} = cookies;

    if (username === undefined || password === undefined) {
        res.sendStatus(401);
    } else {
        const user = authentication(username, password);
        if (!user) {
            res.sendStatus(401);
        } else {
            req.user = user;
            next();
        }
    }
});

app.post('/api/create_event', (req, res) => {
    if (!req.user.is_host) {
        res.status(400).send('Only hosts can create events');
    } else {}
    const data: Record<string, string> = req.body;

    const title = data.title?.trim();
    const description = data.description?.trim();
    const timestamp = new Date(data.timestamp ?? '');
    const price = parseFloat(data.price ?? '');
    const capacity = data.capacity === ""
        ? undefined
        : parseFloat(data.capacity ?? '');

    if (
        // Ensures that title or description is non-empty
        !title
        || !description

        // Ensures that timestamp is valid and in the future
        || isNaN(timestamp.getTime())
        || timestamp <= new Date()

        // Ensures that price is valid and non-negative
        || !isFinite(price)
        || price < 0

        // Ensures that capacity is either undefined or valid and non-negative
        || (capacity !== undefined
            && (
                !isFinite(capacity)
                || capacity < 0
            ))
    ) {
        // Handle when any data is invalid
        res.status(400).send('Invalid event data');
    } else {
        // Make event
        make_event({
            host_username: req.user.username,
            title,
            description,
            // Convert Date to ISO date string
            timestamp: timestamp.toJSON(),
            price,
            capacity,
            sold_tickets: 0,
        });
        res.redirect('/host');
    }
});

app.get('/api/events', (req, res) => res.json(get_all_events(req.user)));

app.get('/api/book/:event_id', (req, res) => {
    const {event_id} = req.params;
    const ticket_or_error = make_ticket(event_id, req.user);
    const status_code = typeof ticket_or_error === 'string' ? 400 : 200;
    res.status(status_code).json(ticket_or_error);
});

app.get('/api/get_tickets', (req, res) => {
    const {username} = req.user;
    res.json(get_tickets_for_user(username));
});

app.listen(port, () => console.log('Listening on http://' + local_ip_address()));
