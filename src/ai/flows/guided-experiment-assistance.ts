'use server';

/**
 * @fileOverview Provides AI-powered assistance during experiments, offering real-time guidance and suggestions.
 *
 * - provideGuidance - A function that provides guidance during the experiment.
 * - GuidanceInput - The input type for the provideGuidance function.
 * - GuidanceOutput - The return type for the provideGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GuidanceInputSchema = z.object({
  experimentName: z.string().describe('The name of the experiment being conducted.'),
  currentStep: z.string().describe('The current step the user is on.'),
  userActions: z.string().describe('A description of the actions the user has taken so far.'),
  reagents: z.string().describe('A list of reagents being used in the experiment.'),
});
export type GuidanceInput = z.infer<typeof GuidanceInputSchema>;

const GuidanceOutputSchema = z.object({
  guidance: z.string().describe('AI-provided guidance and suggestions for the experiment.'),
  nextStepSuggestion: z.string().optional().describe('Suggestion for the next step in the experiment.'),
  isCorrect: z.boolean().describe('Whether the user actions are correct based on current step.'),
});
export type GuidanceOutput = z.infer<typeof GuidanceOutputSchema>;

export async function provideGuidance(input: GuidanceInput): Promise<GuidanceOutput> {
  return provideGuidanceFlow(input);
}

const guidancePrompt = ai.definePrompt({
  name: 'guidancePrompt',
  input: {schema: GuidanceInputSchema},
  output: {schema: GuidanceOutputSchema},
  prompt: `You are an AI assistant that is guiding a user through a chemistry experiment.

  Experiment Name: {{{experimentName}}}
  Current Step: {{{currentStep}}}
  User Actions: {{{userActions}}}
  Reagents: {{{reagents}}}

  Provide clear and concise guidance to the user based on their current step and actions. Make sure to set the isCorrect field to indicate whether or not the user is doing things correctly.
  If the user is on the right track suggest what they should do next. The suggestion should be very specific.
  For example, if the user is supposed to add 10ml of HCL, but the user only added 5ml, set isCorrect to false and suggest adding another 5ml of HCL.
  Do not offer general advice.
  If the user has completed the experiment successfully or there is nothing else they need to do, just say that they have completed the experiment successfully and do not provide a next step suggestion.
`,
});

const provideGuidanceFlow = ai.defineFlow(
  {
    name: 'provideGuidanceFlow',
    inputSchema: GuidanceInputSchema,
    outputSchema: GuidanceOutputSchema,
  },
  async input => {
    const {output} = await guidancePrompt(input);
    return output!;
  }
);
