'use server';

/**
 * @fileOverview Summarizes data using GenAI to identify trends and patterns.
 *
 * - summarizeData - A function that summarizes the data.
 * - SummarizeDataInput - The input type for the summarizeData function.
 * - SummarizeDataOutput - The return type for the summarizeData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDataInputSchema = z.string().describe('The dataset to summarize.');
export type SummarizeDataInput = z.infer<typeof SummarizeDataInputSchema>;

const SummarizeDataOutputSchema = z.string().describe('A summary of the data.');
export type SummarizeDataOutput = z.infer<typeof SummarizeDataOutputSchema>;

export async function summarizeData(input: SummarizeDataInput): Promise<SummarizeDataOutput> {
  return summarizeDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDataPrompt',
  input: {schema: SummarizeDataInputSchema},
  output: {schema: SummarizeDataOutputSchema},
  prompt: `Summarize the following dataset, highlighting the key trends and patterns:\n\n{{{input}}}`,
});

const summarizeDataFlow = ai.defineFlow(
  {
    name: 'summarizeDataFlow',
    inputSchema: SummarizeDataInputSchema,
    outputSchema: SummarizeDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
