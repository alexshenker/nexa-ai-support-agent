import ai_client, { MODEL } from "@/app/ai/ai";
import { addCategory, createTicket } from "@/app/db/db";
import dedupCategory from "@/app/utils/dedupCategory";
import { PreviousResponseID } from "@/types";
import { NextRequest } from "next/server";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const ROLE =
    "You are an assistant that interacts with users via a chat interface. Your goal is to guide users through a series of questions that gather information needed to open a support ticket. There is no specific product involved. This is a general support ticket system. ";

const INSTRUCTIONS = `You must collect the following information from each user:
1. First name
2. Last name
3. Issue description
You must do so by asking the user a series of questions, collecting one piece of information at a time.
After the user provides a description, you must create a fitting category for the issue and return it in the outlined object below.
If the user provides an invalid answer, you must acknowledge their message if you determine that you should, and then ask them to answer the question until all the information has been provided.
Once you've collected all the information, you must thank the user with the first and last names they have provided, and assure them the ticket will be handled shortly.
Your response should always be a JSON object with the following structure:
{
  responseToUser: string,
  dataCollected: {
    "firstName": string | null,
    "lastName": string | null,
    "issueDescription": string | null,
    "category": string | null
  }
}
Each value should be a string after it has been provided, and null if it has not been provided yet.
Finally: The fewer tokens you use, the better. But ensure your responses are complete.  
`;

const UserData = z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    issueDescription: z.string().nullable(),
    category: z.string().nullable(),
});
type UserData = z.infer<typeof UserData>;

const UserRequest = z.object({
    message: z.string(),
    previous_response_id: PreviousResponseID,
});

const AIResponse = z.object({
    responseToUser: z.string(),
    dataCollected: UserData,
});
type AIResponse = z.infer<typeof AIResponse>;

export const ResponseToUser = z.object({
    responseToUser: z.string(),
    previous_response_id: PreviousResponseID,
});
export type ResponseToUser = z.infer<typeof ResponseToUser>;

const allDataCollected = (data: UserData): boolean => {
    const values = Object.values(data);
    return values.every((value) => value !== null && value.trim() !== "");
};

export async function POST(request: NextRequest) {
    const body = await request.json();

    const bodyParsed = UserRequest.safeParse(body);
    if (!bodyParsed.success) {
        return Response.json(
            {
                error: "Invalid request body",
                issues: bodyParsed.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
    }

    const { message, previous_response_id } = bodyParsed.data;

    const response = await ai_client.responses.create({
        model: MODEL,
        input: message,
        instructions: ROLE + INSTRUCTIONS,
        max_output_tokens: 150, //Seems to be sufficient for most support use cases
        previous_response_id: previous_response_id,
        text: {
            format: zodTextFormat(AIResponse, "ai_response"),
        },
    });

    const parsedOutputText = AIResponse.safeParse(response.output_text);

    if (!parsedOutputText.success) {
        console.error("Failed to parse output text:", parsedOutputText.error);
        return Response.json(
            {
                error: "Failed to parse AI response",
                issues: parsedOutputText.error.flatten().fieldErrors,
            },
            { status: 500 }
        );
    }

    if (allDataCollected(parsedOutputText.data.dataCollected)) {
        //Handle category deduplication and ticket creation
        const categoryDeduped = await dedupCategory(
            parsedOutputText.data.dataCollected.category ?? ""
        );

        if (categoryDeduped.isNew) {
            addCategory(categoryDeduped.categoryName);
        }

        createTicket({
            user_first: parsedOutputText.data.dataCollected.firstName ?? "",
            user_last: parsedOutputText.data.dataCollected.lastName ?? "",
            category: categoryDeduped.categoryName,
            description:
                parsedOutputText.data.dataCollected.issueDescription ?? "",
        });
    }

    const responseToUser: ResponseToUser = {
        responseToUser: parsedOutputText.data.responseToUser,
        previous_response_id: response.id as PreviousResponseID,
    };

    return Response.json(responseToUser);
}
