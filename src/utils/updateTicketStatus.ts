import { TicketId, TicketStatus } from "@/types";

const updateTicketStatus = async (
    ticketId: TicketId,
    status: TicketStatus
): Promise<void> => {
    const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        body: JSON.stringify({
            status,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch ticket");
    }

    return;
};

export default updateTicketStatus;
