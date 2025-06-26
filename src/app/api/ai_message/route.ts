import { NextRequest } from "next/server";
import OpenAI from "openai";
import { ResponsesModel } from "openai/resources";
//Sends message to AI and returns the response

//went with gpt-4o-mini because its advanced + lightweight + fast
const MODEL: ResponsesModel = "gpt-4o-mini";

const CATEGORIES: string[] = [];

const ROLE =
    "You are an assistant that interacts with users via a chat interface. Your goal is to guide users through a series of questions that gather information needed to open a support ticket. There is no specific product involved. This is a general support ticket system.";

const INSTRUCTIONS = `You must collect the following information from each user:
1. First name
2. Last name
3. Issue description
4. Category
You must do so by asking the user a series of questions, collecting one piece of information at a time.
If the user provides an invalid answer, you must acknowledge their message if you determine that you should, and then ask them to answer the question asked until all the information has been provided.
Once you've collected all the information, you will thank the user by the first and last name the they have provided.
Your final response should be a JSON object with the following structure:
{
  responseToUser: "Thank you, [firstName] [lastName], for providing the information.",
  dataCollected: {
    "firstName": "...",
    "lastName": "...",
    "issueDescription": "...",
    "category": "..."
  }
}
Finally: The fewer tokens you use, the better. But ensure your responses are complete.  
`;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    const body = await request.json();

    const { message, previous_response_id } = body;

    const response = await client.responses.create({
        model: MODEL,
        input: "Write a one-sentence bedtime story about a unicorn.",
        //Collect previous_response_id for context
        instructions: "Be creative and use vivid imagery.",
        max_output_tokens: 150, //Seems to be sufficient for most support use cases
        previous_response_id: INSTRUCTIONS,
    });
}
