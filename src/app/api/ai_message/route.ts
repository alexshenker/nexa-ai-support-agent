import { PreviousResponseID } from "@/types";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import { ResponsesModel } from "openai/resources";
import { z } from "zod";
//Sends message to AI and returns the response

//went with gpt-4o-mini because its advanced + lightweight + fast
const MODEL: ResponsesModel = "gpt-4o-mini";

const CATEGORIES: string[] = [];

const ROLE =
    "You are an assistant that interacts with users via a chat interface. Your goal is to guide users through a series of questions that gather information needed to open a support ticket. There is no specific product involved. This is a general support ticket system. ";

const INSTRUCTIONS = `You must collect the following information from each user:
1. First name
2. Last name
3. Issue description
4. Category
You must do so by asking the user a series of questions, collecting one piece of information at a time.
If the user provides an invalid answer, you must acknowledge their message if you determine that you should, and then ask them to answer the question asked until all the information has been provided.
Once you've collected all the information, you will thank the user by the first and last name the they have provided.
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

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const UserData = z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    issueDescription: z.string().nullable(),
    category: z.string().nullable(),
});

const UserRequest = z.object({
    message: z.string(),
    previous_response_id: PreviousResponseID,
});

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

    const response = await client.responses.create({
        model: MODEL,
        input: message,
        instructions: ROLE + INSTRUCTIONS,
        max_output_tokens: 150, //Seems to be sufficient for most support use cases
        previous_response_id: previous_response_id,
        text: {
            format: zodTextFormat(UserData, "user_data"),
        },
    });

    return Response.json(response);
}
