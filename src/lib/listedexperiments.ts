import type { Experiment } from './types';
import { Reagents } from './reagents';

export const sampleExperiments: Experiment[] = [{
  id: 'haber-process',
  name: 'Habers Ammonia Manufacturing Process',
  description: 'Manufacture ammonia using nitrogen and hydrogen gas in high pressure and temperature',
  steps: [
    { id: '1', instruction: 'Turn on Nitrogen Valve' },
    { id: '2', instruction: 'Turn on Hydrogen Valve' },
    { id: '3', instruction: 'Enable compressor' },
    { id: '4', instruction: 'Heat the solution gently using the reactor.' },
  ],
  reagents: [Reagents.N2,Reagents.H2],
  expectedResults: 'The final solution should be pink and have a volume of around 100ml. When heated, it should produce steam.',
}];