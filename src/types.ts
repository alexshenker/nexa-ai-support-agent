import { z } from "zod";

export type AIResponseID = string & { __brand: "AI_Response_ID" };
export const AIResponseID = z.custom<AIResponseID>();

export const UserData = z.object({
    firstName: z.string(),
    lastName: z.string(),
    issueDescription: z.string(),
    category: z.string(),
});

export type UserData = z.infer<typeof UserData>;

export const UserRequest = z.object({
    message: z.string(),
    previous_response_id: AIResponseID.nullable(),
});
export type UserRequest = z.infer<typeof UserRequest>;

export const AIResponse = z.object({
    responseToUser: z.string(),
    dataCollected: UserData,
});

export type AIResponse = z.infer<typeof AIResponse>;

export const ResponseToUser = z.object({
    responseToUser: z.string(),
    previous_response_id: AIResponseID,
});

export type ResponseToUser = z.infer<typeof ResponseToUser>;

export type TicketId = number & { __brand: "Ticket_Id" };
export const TicketId = z.custom<TicketId>();

export const ticketStatuses = ["open", "closed"] as const;
export const TicketStatus = z.enum(ticketStatuses);
export type TicketStatus = z.infer<typeof TicketStatus>;

export const Ticket = z.object({
    id: TicketId,
    user_first: z.string(),
    user_last: z.string(),
    category: z.string(),
    description: z.string(),
    status: TicketStatus,
    created_at: z.string(),
});

export type Ticket = z.infer<typeof Ticket>;
