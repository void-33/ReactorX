import { Reagent } from "./types";

export const Reagents = {
  N2: { id: 'nitrogen', name: 'Nitrogen Gas', color: '#7a7a72' },
  H2: { id: 'hydrogen', name: 'Hydrogen', color: '#fcba03' },
} satisfies Record<string, Reagent>;
