import { getTickets } from "@/db/db";

export async function GET() {
    const tickets = getTickets();

    return Response.json(tickets);
}
