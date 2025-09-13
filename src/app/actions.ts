
"use server";

import { validateSchema } from "@/ai/flows/schema-validation";
import { postcardSchema } from "@/lib/schema";

export async function validatePostcardData(data: unknown) {
  const schemaDescription = `
    A postcard object with the following fields:
    - id: string (unique identifier, should not be changed)
    - name: string (must be at least 3 characters long)
    - category: one of "Travel", "Art", "Greeting", "Vintage", "Holiday"
    - price: a positive number
    - stock: a non-negative integer
    - description: string (optional, a brief summary of the postcard)
  `;

  // First, basic Zod validation to ensure structure is roughly correct for the AI
  const parsedForAI = postcardSchema.partial().safeParse(data);
  if (!parsedForAI.success || typeof parsedForAI.data !== 'object' || parsedForAI.data === null) {
    return { isValid: false, validationErrors: ["Invalid data structure"], reasoning: "The provided data does not match the basic postcard structure." };
  }

  // Then call the AI validation flow
  try {
    const result = await validateSchema({
      data: parsedForAI.data,
      schemaDescription,
    });
    return result;
  } catch (error) {
    console.error("AI validation failed:", error);
    return { isValid: false, validationErrors: ["AI validation service is unavailable."], reasoning: "Could not connect to the validation service." };
  }
}

