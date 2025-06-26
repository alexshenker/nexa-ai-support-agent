import { Ticket, TicketId } from "@/types";

const sample_tickets: Ticket[] = [
    {
        id: 1 as TicketId,
        user_first: "Sarah",
        user_last: "Johnson",
        category: "Login Issues",
        description:
            "I can't log into my account. It says my password is incorrect but I'm sure it's right.",
        status: "open",
        created_at: "2024-12-01 09:15:30",
    },
    {
        id: 2 as TicketId,
        user_first: "Michael",
        user_last: "Chen",
        category: "Performance",
        description:
            "The application is running extremely slowly. Pages take over 30 seconds to load.",
        status: "open",
        created_at: "2024-12-01 10:42:15",
    },
    {
        id: 3 as TicketId,
        user_first: "Emma",
        user_last: "Davis",
        category: "Billing",
        description:
            "I was charged twice for my subscription this month. Please refund the duplicate charge.",
        status: "closed",
        created_at: "2024-11-30 14:20:45",
    },
    {
        id: 4 as TicketId,
        user_first: "James",
        user_last: "Wilson",
        category: "Feature Request",
        description:
            "It would be great if we could export reports to PDF format.",
        status: "open",
        created_at: "2024-11-30 16:55:00",
    },
    {
        id: 5 as TicketId,
        user_first: "Lisa",
        user_last: "Anderson",
        category: "Bug Report",
        description:
            "The submit button on the contact form doesn't work. Nothing happens when I click it.",
        status: "open",
        created_at: "2024-12-01 11:30:22",
    },
    {
        id: 6 as TicketId,
        user_first: "Robert",
        user_last: "Martinez",
        category: "Account Issues",
        description:
            "My account was suspended without any warning or explanation.",
        status: "closed",
        created_at: "2024-11-29 08:45:10",
    },
    {
        id: 7 as TicketId,
        user_first: "Jennifer",
        user_last: "Taylor",
        category: "Data Issues",
        description: "Some of my saved data disappeared after the last update.",
        status: "open",
        created_at: "2024-12-01 13:10:55",
    },
    {
        id: 8 as TicketId,
        user_first: "David",
        user_last: "Brown",
        category: "Performance",
        description: "The mobile app crashes whenever I try to upload a photo.",
        status: "open",
        created_at: "2024-11-30 17:25:33",
    },
    {
        id: 9 as TicketId,
        user_first: "Maria",
        user_last: "Garcia",
        category: "Billing",
        description:
            "I need to update my payment method but can't find the option in settings.",
        status: "closed",
        created_at: "2024-11-29 12:00:00",
    },
    {
        id: 10 as TicketId,
        user_first: "Kevin",
        user_last: "Lee",
        category: "Security",
        description:
            "I received a suspicious email claiming to be from your support team. Is this legitimate?",
        status: "open",
        created_at: "2024-12-01 15:45:18",
    },
];

export default sample_tickets;
