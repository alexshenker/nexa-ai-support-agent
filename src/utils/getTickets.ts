import { Ticket } from "@/types";
import { z } from "zod";

const getTickets = async (): Promise<Ticket[]> => {
    const tickets = await fetch("/api/tickets", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!tickets.ok) {
        throw new Error(
            `Failed to fetch tickets: ${tickets.status} ${tickets.statusText}`
        );
    }

    const data = await tickets.json();

    const ticketsParsed = z.array(Ticket).safeParse(data);
    if (!ticketsParsed.success) {
        throw new Error(
            `Failed to parse tickets: ${ticketsParsed.error.message}`
        );
    }
    return ticketsParsed.data;
};

export default getTickets;
