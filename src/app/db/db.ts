import Database from "better-sqlite3";
import { z } from "zod";
const db = new Database("demo.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_first TEXT,
    user_last TEXT,
    category TEXT,
    description TEXT,
    status TEXT DEFAULT 'open'
  );

   CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );
`);

export type TicketId = number & { __brand: "Ticket_Id" };
export const TicketId = z.custom<TicketId>();

const ticketStatuses = ["open", "closed"] as const;
const TicketStatus = z.enum(ticketStatuses);
export type TicketStatus = z.infer<typeof TicketStatus>;

const Ticket = z.object({
    id: TicketId,
    user_first: z.string(),
    user_last: z.string(),
    category: z.string(),
    description: z.string(),
    status: TicketStatus,
});

export type Ticket = z.infer<typeof Ticket>;

export function createTicket(ticket: OmitMod<Ticket, "id" | "status">): void {
    const stmt = db.prepare(
        "INSERT INTO tickets (user_first, user_last, category, description) VALUES (?, ?, ?, ?)"
    );

    stmt.run(
        ticket.user_first,
        ticket.user_last,
        ticket.category,
        ticket.description
    );
}

export function getTickets() {
    return db.prepare("SELECT * FROM tickets").all();
}

export function getTicketById(ticketId: TicketId): Ticket | null {
    const ticket = db
        .prepare("SELECT * FROM tickets WHERE id = ?")
        .get(ticketId);

    if (!ticket) {
        console.error("No ticket found with ID:", ticketId);
        return null;
    }

    const parsedTicket = Ticket.safeParse(ticket);
    if (!parsedTicket.success) {
        console.error("Failed to parse ticket:", parsedTicket.error);
        return null;
    }

    return parsedTicket.data;
}

export function closeTicket(ticketId: TicketId): void {
    const stmt = db.prepare(
        "UPDATE tickets SET status = 'closed' WHERE id = ?"
    );

    const res = stmt.run(ticketId);

    if (res.changes === 0) {
        console.error(`No ticket found with ID ${ticketId}`);
    }
}

export function addCategory(name: string): void {
    const stmt = db.prepare(
        "INSERT OR IGNORE INTO categories (name) VALUES (?)"
    );
    stmt.run(name);
}

export function getCategories(): string[] {
    const rows = db.prepare("SELECT name FROM categories").all();

    const parsedRows = z.array(z.object({ name: z.string() })).safeParse(rows);
    if (!parsedRows.success) {
        console.error("Failed to parse categories:", parsedRows.error);
        return [];
    }

    return parsedRows.data.map((row) => row.name);
}
