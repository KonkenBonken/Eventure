import {get_all_events, make_event} from "./event"
import {get_tickets_for_user, make_ticket} from "./ticket"
import {make_user} from "./users"



describe("Eventure MVPs", () => {
    test("Ticket slots full", () => {
            const event_ex1 = make_event({
            title: "Sip & Paint",
            description: "Drink some wine next to a beautiful lake while socializing and painting whatever you want",
            timestamp: new Date(2026, 3, 8, 16, 30).toJSON(),
            price: 70,
            capacity: 10,
            sold_tickets: 10,
            });

            const user_ex1 = make_user("Alexandria", "LoveMyDogLucas", false)

        expect(make_ticket(event_ex1.event_id, user_ex1.username )).toBe(false);
    });

    test("Successfully buy ticket", () => {
            const event_ex2 = make_event({
            title: "Laser tag",
            description: "Got some unresolved issues with your friends? Why not battle it out with laser guns!",
            timestamp: new Date(2026, 3, 8, 16, 30).toJSON(),
            price: 70,
            capacity: 24,
            sold_tickets: 10,
            });

            const user_ex2 = make_user("marking", "marketing", false)
            const ticket_ex = make_ticket(event_ex2.event_id, user_ex2.username)


        expect(get_tickets_for_user(user_ex2.username)).toStrictEqual([ticket_ex]);
    });

    test("See all events", () => {

        expect(get_all_events().length).toBe(5);
    
    });

    test("Attempt to buy two tickets", () => {
            const event_ex3 = make_event({
            title: "Beach episode",
            description: "Maybe summer will come earlier if we plan for it now, join us on a bus trip to the beach!",
            timestamp: new Date(2026, 4, 20, 11, 30).toJSON(),
            price: 85,
            capacity: 30,
            sold_tickets: 2,
            });

            const user_ex3 = make_user("CheapandTastyChopSueyy", "Primosmybeloved", false)
            const ticket_ex = make_ticket(event_ex3.event_id, user_ex3.username)

        expect(make_ticket(event_ex3.event_id, user_ex3.username)).toBe(false);
    
    });



})