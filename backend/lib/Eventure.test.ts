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

            const user_ex1 = make_user()

        expect(make_ticket(event_ex1.event_id, user_ex1.user_id )).toBe(false);
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

            const user_ex2 = make_user()
            const ticket_ex = make_ticket(event_ex2.event_id, user_ex2.user_id)


        expect(get_tickets_for_user(user_ex2.user_id)).toStrictEqual([ticket_ex]);
    });

    test("See all events", () => {

        expect(get_all_events().length).toBe(5);
    
    });



})