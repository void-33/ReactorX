import type { Experiment, Reagent } from './types';

export const reagents: Reagent[] = [
  { id: 'hcl', name: 'Hydrochloric Acid', color: '#a0ced9' },
  { id: 'naoh', name: 'Sodium Hydroxide', color: '#d9a0b8' },
  { id: 'phenolphthalein', name: 'Phenolphthalein', color: '#f0f8ff' },
  { id: 'water', name: 'Water', color: '#e0ffff' },
];

export const sampleExperiment: Experiment = {
  id: 'acid-base-titration',
  name: 'Acid-Base Titration',
  description: 'A simple simulation of titrating HCl with NaOH using Phenolphthalein as an indicator.',
  steps: [
    { id: '1', instruction: 'Add 50ml of Hydrochloric Acid to a beaker.' },
    { id: '2', instruction: 'Add 2 drops of Phenolphthalein to the beaker.' },
    { id: '3', instruction: 'Slowly add Sodium Hydroxide to the beaker until the solution turns pink.' },
    { id: '4', instruction: 'Heat the solution gently using the burner.' },
  ],
  reagents: reagents,
  expectedResults: 'The final solution should be pink and have a volume of around 100ml. When heated, it should produce steam.',
};
