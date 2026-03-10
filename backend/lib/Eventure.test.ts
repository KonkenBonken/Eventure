import {get_all_events, make_event} from "./event";
import {get_tickets_for_user, make_ticket} from "./ticket";
import {authentication, make_user} from "./users";

const guest_example = make_user("Aaron", "Burr", false);

const host_example = make_user("Eliza", "story", true);

if (!guest_example || !host_example) {
    throw new Error("Could not create a example users");
}

const event_example = make_event({
    host_username: "host",
    title: "Beach episode",
    description: "Maybe summer will come earlier if we plan for it now, join us on a bus trip to the beach!",
    timestamp: new Date(2026, 4, 20, 11, 30).toJSON(),
    price: 85,
    capacity: 30,
    sold_tickets: 2,
});

describe("Eventure tests", () => {
    test("Make host account", () => {
        const user = make_user("Alexander", "ten", true);

        expect(user && user.is_host).toBe(true);
    });

    test("Make guest account", () => {
        const user = make_user("Hamilton", "dolla", false);

        expect(user && !user.is_host).toBe(true);
    });

    test("No ticket if ticket slots full", () => {
        const event_ex = make_event({
            host_username: host_example.username,
            title: "Sip & Paint",
            description: "Drink some wine next to a beautiful lake while socializing and painting whatever you want",
            timestamp: new Date(2026, 3, 8, 16, 30).toJSON(),
            price: 70,
            capacity: 10,
            sold_tickets: 10,
        });

        expect(make_ticket(event_ex.event_id, guest_example)).toBe("Sorry, Sip & Paint is sold out");
    });

    test("Successfully buy ticket", () => {
        const ticket_ex = make_ticket(event_example.event_id, guest_example);

        expect(get_tickets_for_user(guest_example.username)).toStrictEqual([ticket_ex]);
    });

    test("Host only see their own events", () => {
        expect(get_all_events(host_example).length).toBe(1);
    });

    test("User sees all events", () => {
        expect(get_all_events(guest_example).length).toBe(5);
    });

    test("Attempt to buy two tickets for same event", () => {
        expect(make_ticket(event_example.event_id, guest_example)).toStrictEqual("Sorry, you already have a ticket for Beach episode");
    });

    test("Attempt to buy two tickets separate tickets", () => {
        const event_ex3 = make_event({
            host_username: "host",
            title: "Beach episode",
            description: "Maybe summer will come earlier if we plan for it now, join us on a bus trip to the beach!",
            timestamp: new Date(2026, 4, 20, 11, 30).toJSON(),
            price: 85,
            capacity: 30,
            sold_tickets: 2,
        });

        const event_ex4 = make_event({
            host_username: "host",
            title: "Bird spotting",
            description: "Look at all the chonky birds, aren't they beautiful? Well come with us and find out",
            timestamp: new Date(2026, 3, 13, 7, 30).toJSON(),
            price: 15,
            capacity: 13,
            sold_tickets: 5,
        });

        const ticket_ex = make_ticket(event_ex3.event_id, guest_example);

        expect(typeof ticket_ex).not.toBe("string");
        expect(make_ticket(event_ex4.event_id, guest_example)).not.toBe(false);
    });

    test("See a user's tickets", () => {
        expect(get_tickets_for_user(guest_example.username).length).toBe(3);
    });

    test("Can't make an account if username is already in use", () => {
        expect(make_user(guest_example.username, "Doggos", false)).toBe(false);
    });

    test("Authentication with username and password", () => {
        expect(authentication("Aaron", "Burr")).toBe(guest_example);
    });

    test("Fail to log in if wrong password", () => {
        expect(authentication("Aaron", "Bjorn")).toBe(false);
    });

    test("Can't buy ticket as host", () => {
        expect(make_ticket(event_example.event_id, host_example)).toBe("Hosts cannot buy tickets");
    });
});