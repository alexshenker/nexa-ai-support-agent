import { getTicketById, updateTicketStatus } from "@/db/db";
import { TicketId, UpdateTicketStatusBody } from "@/types";

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

export async function PUT(
    req: Request,
    { params }: { params: Promise<Params> }
) {
    const { ticket_id } = await params;

    const body = await req.json();

    const bodyParsed = UpdateTicketStatusBody.safeParse(body);

    if (!bodyParsed.success) {
        return Response.json(
            { error: bodyParsed.error.message },
            {
                status: 400,
            }
        );
    }

    updateTicketStatus(ticket_id, bodyParsed.data.status);

    return Response.json({ status: 200 });
}
