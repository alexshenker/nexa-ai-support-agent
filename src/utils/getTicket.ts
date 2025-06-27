import { Ticket, TicketId } from "@/types";
import { z } from "zod";

const Response = z.union([Ticket, z.null()]);

const getTicket = async (ticketId: TicketId) => {
    const response = await fetch(`/api/tickets/${ticketId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch ticket");
    }

    const data = await response.json();

    const parsed = Response.safeParse(data);
    if (!parsed.success) {
        throw new Error(`Failed to parse ticket: ${parsed.error.message}`);
    }

    return parsed.data;
};

export default getTicket;
