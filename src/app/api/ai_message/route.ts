import ai_client, { MODEL } from "@/ai/ai";
import {
    AIResponse,
    AIResponseID,
    ResponseToUser,
    TicketId,
    UserData,
    UserRequest,
} from "@/types";
import { MAX_CHARACTERS } from "@/utils/constants";
import handleTicketCreation from "@/utils/handleTicketCreation";
import { NextRequest } from "next/server";
import { zodTextFormat } from "openai/helpers/zod.mjs";

const ROLE =
    "You are an assistant that interacts with users via a chat interface. Your goal is to guide users through a series of questions that gather information needed to open a support ticket. There is no specific product involved. This is a general support ticket system. ";

const TICKET_CREATED_MESSAGE =
    "Thank you for providing your information. Your support ticket has been created!";

const INSTRUCTIONS = `You must collect the following information from each user:
1. First name
2. Last name
3. Issue description
You must do so by asking the user a series of questions, collecting one piece of information at a time.
After the user provides a description, you must create a fitting category for the issue and return it in the outlined object below.
If the user provides an invalid answer, you must acknowledge their message if you determine that you should, and then ask them to answer the question until all the information has been provided.
NOTE: Its possible that the user will provide information out of order - you must be able to handle this and ask for the missing information politely.
Once you've collected all the information, you must the responseToUser value MUST be this exact string: "${TICKET_CREATED_MESSAGE}", and assure them the ticket will be handled shortly.
Do not inform the user how an issue has been categorized. Just thank them.
Your response should always be a JSON object with the following structure:
{
  responseToUser: string,
  dataCollected: {
    "firstName": string,
    "lastName": string,
    "issueDescription": string,
    "category": string
  }
}
If a value has not been collected yet, it should be returned as an empty string.
Finally: The fewer tokens you use, the better. But ensure your responses are complete.  
`;

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

    if (message.trim() === "") {
        return Response.json(
            {
                error: "Message cannot be empty",
            },
            { status: 400 }
        );
    }

    if (message.length > MAX_CHARACTERS) {
        return Response.json(
            {
                error: `Message exceeds maximum length of ${MAX_CHARACTERS} characters`,
            },
            { status: 400 }
        );
    }

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

    const responseObject = JSON.parse(response.output_text);

    const parsedOutputText = AIResponse.safeParse(responseObject);

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

    let ticketId: TicketId | null = null;

    if (allDataCollected(parsedOutputText.data.dataCollected)) {
        // We have what we need to create a ticket
        try {
            ticketId = await handleTicketCreation(
                parsedOutputText.data.dataCollected
            );
        } catch (error) {
            console.error("Error handling ticket creation:", error);
            return Response.json(
                {
                    error: "Failed to handle ticket creation",
                },
                { status: 500 }
            );
        }
    }

    const responseToUser: ResponseToUser = {
        responseToUser: parsedOutputText.data.responseToUser,
        previous_response_id: response.id as AIResponseID,
        ticketId,
    };

    return Response.json(responseToUser);
}
