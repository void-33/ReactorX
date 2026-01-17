// Emergency Response Simulation Types

export interface PlantComponent {
  id: string;
  name: string;
  type: 'tank' | 'valve' | 'pump' | 'tower' | 'control' | 'spray' | 'safety' | 'pipeline';
  position: { x: number; y: number };
  status: 'operational' | 'warning' | 'critical' | 'inactive';
  isActive?: boolean;
  capacity?: number;
  currentValue?: number;
}

export interface Valve {
  id: string;
  name: string;
  position: { x: number; y: number };
  isOpen: boolean;
  type: 'manual' | 'automatic';
  controlledBy?: string; // e.g., 'tank-1'
}

export interface Pump {
  id: string;
  name: string;
  position: { x: number; y: number };
  isRunning: boolean;
  flowRate: number; // L/min
}

export interface GasLeak {
  id: string;
  source: string; // component id
  intensity: number; // 0-100
  concentration: number; // ppm
  radius: number; // pixels
  startTime: number;
}

export interface SimulationState {
  isRunning: boolean;
  elapsedTime: number;
  gasConcentration: number; // ppm
  spraySystemActive: boolean;
  valvesOpen: Set<string>;
  pumpsRunning: Set<string>;
  ppeEquipped: 'none' | 'gloves' | 'mask' | 'suit' | 'full';
  leakDetected: boolean;
  evacuationTriggered: boolean;
}

export interface ActionLog {
  id: string;
  timestamp: number;
  action: string;
  component?: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface ProcedureStep {
  id: string;
  instruction: string;
  completed: boolean;
  critical: boolean;
  requiredPPE?: 'none' | 'gloves' | 'mask' | 'suit' | 'full';
}
