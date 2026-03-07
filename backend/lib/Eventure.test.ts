import {get_all_events, make_event} from "./event"
import {get_tickets_for_user, make_ticket} from "./ticket"
import {authentication, make_user} from "./users"

const Eventurer = make_user("Aaron", "Burr", false)

const Host = make_user("Eliza", "story", true)

const event_ex = make_event({
    title: "Beach episode",
    host_username: "host",
    description: "Maybe summer will come earlier if we plan for it now, join us on a bus trip to the beach!",
    timestamp: new Date(2026, 4, 20, 11, 30).toJSON(),
    price: 85,
    capacity: 30,
    sold_tickets: 2,
});

describe("Eventure tests", () => {
    test("Make host account", () => {
        const host = make_user("Alexander", "ten", true)
        
        host === false ? "Uh oh" : expect(host.is_host).toBe(true)
    })

    test("Make user account", () => {
        const no_father = make_user("Hamilton", "dolla", false)

        no_father === false? "Uh oh" : expect(no_father.is_host).toBe(false)
    })


    test("No ticket if ticket slots full", () => {
            const event_ex2 = make_event({
            title: "Sip & Paint",
            host_username: "Eliza",
            description: "Drink some wine next to a beautiful lake while socializing and painting whatever you want",
            timestamp: new Date(2026, 3, 8, 16, 30).toJSON(),
            price: 70,
            capacity: 10,
            sold_tickets: 10,
            });


        Eventurer === false? "Uh oh" : expect(make_ticket(event_ex2.event_id, Eventurer )).toStrictEqual("Sorry, Sip & Paint is sold out");
    });

    test("Successfully buy ticket", () => {

        const ticket_ex = Eventurer === false ? "Uh oh" : make_ticket(event_ex.event_id, Eventurer)
        Eventurer === false ? "Uh oh" : expect(get_tickets_for_user(Eventurer.username)).toStrictEqual([ticket_ex]);
    });

    test("Host only see their own events", () => {

        Host === false ? "Uh oh" : expect(get_all_events(Host).length).toBe(1)
    
    })

    test("User sees all events", () => {

        Eventurer === false ? "Uh oh" : expect(get_all_events(Eventurer).length).toBe(5);
    
    });

    test("Attempt to buy two tickets for same event", () => {


            const ticket_ex = Eventurer === false ? "Uh oh" : make_ticket(event_ex.event_id, Eventurer)

        Eventurer === false ? "Uh oh" : expect(make_ticket(event_ex.event_id, Eventurer)).toStrictEqual("Sorry, you already have a ticket for Beach episode");
    
    });

    test("Attempt to buy two tickets sperate tickets", () => {
            const event_ex3 = make_event({
            title: "Beach episode",
            host_username: "host",
            description: "Maybe summer will come earlier if we plan for it now, join us on a bus trip to the beach!",
            timestamp: new Date(2026, 4, 20, 11, 30).toJSON(),
            price: 85,
            capacity: 30,
            sold_tickets: 2,
            });
            const event_ex4 = make_event({
            title: "Bird spotting",
            host_username: "host",
            description: "Look at all the chonky birds, aren't they beautiful? Well come with us and find out",
            timestamp: new Date(2026, 3, 13, 7, 30).toJSON(),
            price: 15,
            capacity: 13,
            sold_tickets: 5,
            });

            
            const ticket_ex = Eventurer === false ? "Uh oh" : make_ticket(event_ex3.event_id, Eventurer)

        Eventurer === false ? "Uh oh" : expect(make_ticket(event_ex4.event_id, Eventurer)).not.toBe(false);
    });

    test("See a user's tickets", () => {

         Eventurer === false? "Uh oh" : expect(get_tickets_for_user(Eventurer.username).length).toBe(3)
    })
    
    test("Can't make an account if username is already in use", () => {

         Eventurer === false? "Uh oh" : expect(make_user(Eventurer.username, "Doggos", false)).toBe(false)
    })

    test("Fail to log in if wrong password", () => {
        
        expect(authentication("Aaron", "Bjorn")).toBe(false)
    
    })

    test("Can't buy ticket as host", () => {
        
        Host === false? "Uh oh" :expect(make_ticket(event_ex.event_id, Host)).toBe("Hosts cannot buy tickets")
    
    })
})