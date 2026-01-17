export type Reagent = {
  id: string;
  name: string;
  color: string; // hex code
};

export type Liquid = {
	reagent: Reagent;
	volume: number;
	concentration: number;
};

export type LiquidContents = {
  reagent: Reagent | null;
  volume: number; // in ml
  color: string;
	concentration: number;
};

export type EquipmentType = 'beaker' | 'flask' | 'burner'|'testtube';

export type LabItem = {
  id: string;
  type: EquipmentType;
  position: { x: number; y: number };
  contents?: LiquidContents;
	chemicals: Liquid[];
  isHeating?: boolean;
  isSelected?: boolean;
  isDraggingEnabled?: boolean;
};

export type ExperimentStep = {
  id:string;
  instruction: string;
};

export type Experiment = {
  id: string;
  name: string;
  description: string;
  steps: ExperimentStep[];
  reagents: Reagent[];
  expectedResults: string;
};
