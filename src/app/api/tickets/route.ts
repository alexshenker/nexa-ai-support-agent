import { getTickets } from "@/db/db";

export async function GET() {
    const tickets = getTickets();

    if (!tickets) {
        return new Response(JSON.stringify({ error: "No tickets found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    return Response.json(tickets);
}
