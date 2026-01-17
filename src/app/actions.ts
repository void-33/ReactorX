'use server';

import { provideGuidance } from '@/ai/flows/guided-experiment-assistance';
import { analyzeExperimentCompletion } from '@/ai/flows/experiment-completion-analysis';
import type { LabItem, Experiment, ExperimentStep } from '@/lib/types';

export async function getGuidance(
  experiment: Experiment,
  currentStep: ExperimentStep,
  labState: LabItem[]
) {
  const userActions = labState.map(item =>
    `${item.type} at (x: ${Math.round(item.position.x)}, y: ${Math.round(item.position.y)}) containing ${item.contents?.volume || 0}ml of ${item.contents?.reagent?.name || 'nothing'}`
  ).join('. ');

  const input = {
    experimentName: experiment.name,
    currentStep: currentStep.instruction,
    userActions: userActions || 'No actions taken yet.',
    reagents: experiment.reagents.map(r => r.name).join(', '),
  };

  try {
    const result = await provideGuidance(input);
    return result;
  } catch (error) {
    console.error('Error in getGuidance:', error);
    return { guidance: 'An error occurred while fetching guidance. Please try again.', isCorrect: false };
  }
}

export async function analyzeCompletion(
  experiment: Experiment,
  labState: LabItem[],
  stepsTaken: ExperimentStep[]
) {
  const observedResults = labState
    .filter(item => item.contents && item.contents.volume > 0)
    .map(item =>
      `A ${item.type} contains ${item.contents?.volume || 0}ml of a liquid with the color ${item.contents?.color}.`
    ).join(' ') || 'No significant results observed.';

  const input = {
    experimentName: experiment.name,
    stepsTaken: stepsTaken.map(s => s.instruction),
    observedResults: observedResults,
    expectedResults: experiment.expectedResults,
  };

  try {
    const result = await analyzeExperimentCompletion(input);
    return result;
  } catch (error) {
    console.error('Error in analyzeCompletion:', error);
    return { isExperimentComplete: false, completionReason: 'An error occurred during analysis. Please try again.' };
  }
}
