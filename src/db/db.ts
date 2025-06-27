import { Ticket, TicketId } from "@/types";
import Database from "better-sqlite3";
import { z } from "zod";
import sample_categories from "./sample_categories";
import sample_tickets from "./sample_tickets";
const db = new Database("demo.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_first TEXT,
    user_last TEXT,
    category TEXT,
    description TEXT,
    status TEXT DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

   CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );
`);

//Add from samples
const ticketCount = db
    .prepare("SELECT COUNT(*) as count FROM tickets")
    .get() as {
    count: number;
};

if (ticketCount.count === 0) {
    const stmt = db.prepare(
        "INSERT INTO tickets (user_first, user_last, category, description, status, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    );

    sample_tickets.forEach((ticket) => {
        stmt.run(
            ticket.user_first,
            ticket.user_last,
            ticket.category,
            ticket.description,
            ticket.status,
            ticket.created_at
        );
    });
}

const categoryCount = db
    .prepare("SELECT COUNT(*) as count FROM categories")
    .get() as {
    count: number;
};

if (categoryCount.count === 0) {
    const stmt = db.prepare("INSERT INTO categories (name) VALUES (?)");

    sample_categories.forEach((category) => {
        stmt.run(category);
    });
}

export function createTicket(
    ticket: OmitMod<Ticket, "id" | "status" | "created_at">
): void {
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
