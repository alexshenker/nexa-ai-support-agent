import { Ticket, TicketId } from "@/types";
import { categoryTable } from "./sample_categories";

const sample_tickets: Ticket[] = [
    {
        id: 1 as TicketId,
        user_first: "Sarah",
        user_last: "Johnson",
        category: categoryTable["Login Issues"],
        description:
            "I can't log into my account. It says my password is incorrect but I'm sure it's right.",
        status: "open",
        created_at: "2024-12-01 09:15:30",
    },
    {
        id: 2 as TicketId,
        user_first: "Michael",
        user_last: "Chen",
        category: categoryTable["Performance"],
        description:
            "The application is running extremely slowly. Pages take over 30 seconds to load.",
        status: "open",
        created_at: "2024-12-01 10:42:15",
    },
    {
        id: 3 as TicketId,
        user_first: "Emma",
        user_last: "Davis",
        category: categoryTable["Billing"],
        description:
            "I was charged twice for my subscription this month. Please refund the duplicate charge.",
        status: "closed",
        created_at: "2024-11-30 14:20:45",
    },
    {
        id: 4 as TicketId,
        user_first: "James",
        user_last: "Wilson",
        category: categoryTable["Feature Request"],
        description:
            "It would be great if we could export reports to PDF format.",
        status: "open",
        created_at: "2024-11-30 16:55:00",
    },
    {
        id: 5 as TicketId,
        user_first: "Lisa",
        user_last: "Anderson",
        category: categoryTable["Bug Report"],
        description:
            "The submit button on the contact form doesn't work. Nothing happens when I click it.",
        status: "open",
        created_at: "2024-12-01 11:30:22",
    },
];

export default sample_tickets;
