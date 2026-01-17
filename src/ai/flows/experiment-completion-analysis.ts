'use server';

/**
 * @fileOverview A flow to determine if an experiment has been successfully completed.
 *
 * - analyzeExperimentCompletion - A function that analyzes the experiment steps and results to determine if the experiment is complete.
 * - ExperimentCompletionInput - The input type for the analyzeExperimentCompletion function.
 * - ExperimentCompletionOutput - The return type for the analyzeExperimentCompletion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExperimentCompletionInputSchema = z.object({
  experimentName: z.string().describe('The name of the experiment.'),
  stepsTaken: z.array(z.string()).describe('The steps that the user has taken in the experiment.'),
  observedResults: z.string().describe('The observed results of the experiment.'),
  expectedResults: z.string().describe('The expected results of the experiment.'),
});
export type ExperimentCompletionInput = z.infer<typeof ExperimentCompletionInputSchema>;

const ExperimentCompletionOutputSchema = z.object({
  isExperimentComplete: z.boolean().describe('Whether the experiment has been successfully completed.'),
  completionReason: z.string().describe('The reason for the completion status, including any discrepancies or errors.'),
});
export type ExperimentCompletionOutput = z.infer<typeof ExperimentCompletionOutputSchema>;

export async function analyzeExperimentCompletion(
  input: ExperimentCompletionInput
): Promise<ExperimentCompletionOutput> {
  return analyzeExperimentCompletionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'experimentCompletionPrompt',
  input: {schema: ExperimentCompletionInputSchema},
  output: {schema: ExperimentCompletionOutputSchema},
  prompt: `You are an expert chemistry lab assistant. Your job is to determine if a user has successfully completed a chemistry experiment based on the steps they have taken, the results they observed, and the expected results.

Experiment Name: {{{experimentName}}}
Steps Taken: {{#each stepsTaken}}{{{this}}}\n{{/each}}
Observed Results: {{{observedResults}}}
Expected Results: {{{expectedResults}}}

Based on this information, determine if the experiment is complete and provide a reason for your determination. Be specific about any discrepancies between the observed and expected results, and any missing or incorrect steps.
`,
});

const analyzeExperimentCompletionFlow = ai.defineFlow(
  {
    name: 'analyzeExperimentCompletionFlow',
    inputSchema: ExperimentCompletionInputSchema,
    outputSchema: ExperimentCompletionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
