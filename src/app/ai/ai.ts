import OpenAI from "openai";
import { ResponsesModel } from "openai/resources";

//went with gpt-4o-mini because its advanced + lightweight + fast
export const MODEL: ResponsesModel = "gpt-4o-mini";

const ai_client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default ai_client;
