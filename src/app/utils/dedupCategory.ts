import { zodTextFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";
import ai_client, { MODEL } from "../ai/ai";
import { getCategories } from "../db/db";

const ROLE = `You are an assistant that helps deduplicate category names. Your task is to determine if a given category name is similar enough to an existing category in the database, both of which you will be provided in the input. 
Your response should be a JSON object with the following structure:
{
  "categoryName": string,
  "isNew": boolean
}
If it is similar enough, return the already-existing category name with the isNew property set to false. If not, return the new category name as is with the isNew property set to true. You should consider categories similar if they are semantically close or if they are variations of the same concept.`;

const CategoryResponse = z.object({
    categoryName: z.string(),
    isNew: z.boolean(),
});
type CategoryResponse = z.infer<typeof CategoryResponse>;
/**
 * Accepts a potential category and checks if a similar category already exists
 * in our database. If not, it adds the new category to the database.
 * If a similar category exists, it returns the existing category.
 */
const dedupCategory = async (
    categoryCandidate: string
): Promise<CategoryResponse> => {
    const existingCategories = getCategories();

    const message = `This is a candidate category name: ${categoryCandidate}. These are the existing categories in our database: ${existingCategories.join(
        ", "
    )}.`;

    const response = await ai_client.responses.create({
        model: MODEL,
        input: message,
        instructions: ROLE,
        max_output_tokens: 50,
        text: {
            format: zodTextFormat(CategoryResponse, "ai_dedup_response"),
        },
    });

    const parsedOutputText = CategoryResponse.safeParse(response.output_text);
    if (!parsedOutputText.success) {
        console.error("Failed to parse AI response");
        return { categoryName: categoryCandidate, isNew: true };
    }

    return parsedOutputText.data;
};

export default dedupCategory;
