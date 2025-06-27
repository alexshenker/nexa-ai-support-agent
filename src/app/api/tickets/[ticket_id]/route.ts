import { getTicketById } from "@/db/db";
import { TicketId } from "@/types";

type Params = { ticket_id: TicketId };

export async function GET(_: Request, { params }: { params: Promise<Params> }) {
    const { ticket_id } = await params;

    const ticket = getTicketById(ticket_id);

    if (!ticket) {
        return Response.json(
            { error: "Ticket not found" },
            {
                status: 404,
            }
        );
    }

    return Response.json(ticket);
}
