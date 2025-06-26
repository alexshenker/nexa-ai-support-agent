import { z } from "zod";

export type PreviousResponseID = string & { __brand: "Previous_Response_ID" };
export const PreviousResponseID = z.custom<PreviousResponseID>();

export const UserData = z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    issueDescription: z.string().nullable(),
    category: z.string().nullable(),
});

export type UserData = z.infer<typeof UserData>;

export const UserRequest = z.object({
    message: z.string(),
    previous_response_id: PreviousResponseID,
});

export const AIResponse = z.object({
    responseToUser: z.string(),
    dataCollected: UserData,
});

export type AIResponse = z.infer<typeof AIResponse>;

export const ResponseToUser = z.object({
    responseToUser: z.string(),
    previous_response_id: PreviousResponseID,
});

export type ResponseToUser = z.infer<typeof ResponseToUser>;
