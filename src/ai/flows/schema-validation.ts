'use server';

/**
 * @fileOverview Implements a Genkit flow for validating data inputs against a predefined schema using GenAI.
 *
 * - validateSchema - A function that validates data inputs against a schema.
 * - ValidateSchemaInput - The input type for the validateSchema function.
 * - ValidateSchemaOutput - The return type for the validateSchema function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateSchemaInputSchema = z.object({
  data: z.record(z.any()).describe('The data to validate, as a JSON object.'),
  schemaDescription: z.string().describe('A description of the schema to validate against.'),
});

export type ValidateSchemaInput = z.infer<typeof ValidateSchemaInputSchema>;

const ValidateSchemaOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the data is valid according to the schema.'),
  validationErrors: z.array(z.string()).describe('A list of validation errors, if any.'),
  reasoning: z.string().describe('The reasoning behind the validation result.'),
});

export type ValidateSchemaOutput = z.infer<typeof ValidateSchemaOutputSchema>;

export async function validateSchema(input: ValidateSchemaInput): Promise<ValidateSchemaOutput> {
  return validateSchemaFlow(input);
}

const validateSchemaPrompt = ai.definePrompt({
  name: 'validateSchemaPrompt',
  input: {schema: ValidateSchemaInputSchema},
  output: {schema: ValidateSchemaOutputSchema},
  prompt: `You are a data validation expert. You will receive data and a schema description.
Your task is to determine if the data is valid according to the schema.

Schema Description: {{{schemaDescription}}}

Data: {{{data}}}

Respond in a JSON format with the following fields:
- isValid (boolean): true if the data is valid, false otherwise.
- validationErrors (string[]): A list of validation errors, if any. If the data is valid, this should be an empty array.
- reasoning (string): Explain why the data is valid or invalid and list the violated fields.

Ensure that the response can be parsed as a JSON object matching ValidateSchemaOutputSchema.
`,
});

const validateSchemaFlow = ai.defineFlow(
  {
    name: 'validateSchemaFlow',
    inputSchema: ValidateSchemaInputSchema,
    outputSchema: ValidateSchemaOutputSchema,
  },
  async input => {
    const {output} = await validateSchemaPrompt(input);
    return output!;
  }
);
