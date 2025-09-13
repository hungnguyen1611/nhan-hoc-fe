// src/ai/flows/smart-search.ts
'use server';

/**
 * @fileOverview A smart search flow that interprets natural language queries
 *  and returns relevant search results.
 *
 * - smartSearch - A function that accepts a natural language query and returns relevant search results.
 * - SmartSearchInput - The input type for the smartSearch function.
 * - SmartSearchOutput - The return type for the smartSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSearchInputSchema = z.object({
  query: z
    .string()
    .describe('The natural language query to use for searching data.'),
  dataSchema: z.string().describe('The schema of the data to search through, in JSON format.'),
});
export type SmartSearchInput = z.infer<typeof SmartSearchInputSchema>;

const SmartSearchOutputSchema = z.object({
  searchResult: z
    .string()
    .describe('The structured query to retrieve data from datastore'),
});
export type SmartSearchOutput = z.infer<typeof SmartSearchOutputSchema>;

export async function smartSearch(input: SmartSearchInput): Promise<SmartSearchOutput> {
  return smartSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSearchPrompt',
  input: {schema: SmartSearchInputSchema},
  output: {schema: SmartSearchOutputSchema},
  prompt: `You are an AI assistant that helps users search data using natural language queries.

You will receive a natural language query and the schema of the data to search through.
Your goal is to translate the natural language query into a structured query that can be used to retrieve data from a datastore.

Here's the schema of the data:
{{{dataSchema}}}

Here's the natural language query:
{{{query}}}

Return the structured query in a format that can be used to retrieve data from a datastore.
For example, return a json object which can be used to query a Mongo database.
`,
});

const smartSearchFlow = ai.defineFlow(
  {
    name: 'smartSearchFlow',
    inputSchema: SmartSearchInputSchema,
    outputSchema: SmartSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
