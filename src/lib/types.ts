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

export type EquipmentType = 'meter'|'elbow'|'beaker' | 'flask' | 'burner' | 'burette'| 'storagetank'|'pipe'
  | "reactor"
  | "compressor"
  | "condenser"
  | "pump"
  | "valve"
  | "pipe"
  | "storage_tank"
  | "sensor";

export type LabItem = {
  id: string;
  type: EquipmentType;
  position: { x: number; y: number };
  contents?: LiquidContents;
	chemicals: Liquid[];
  isHeating?: boolean;
  isSelected?: boolean;
  isDraggingEnabled?: boolean;
  rotation?: number;

	//industry stuff
  isAnimating?: boolean;
  // Industrial control state
  running?: boolean;          // e.g., compressor/reactor/pump
  temperature?: number;       // current temp in °C
  tempSetpoint?: number;      // desired temp
  pressure?: number;          // current pressure in bar
  pressureSetpoint?: number;  // desired pressure
  flowRate?: number;          // for pipe / pump (ml/sec)
  valveOpen?: boolean;        // for valves
  // Optional gauges / indicators
  statusLight?: "off" | "yellow" | "green" | "red";
  gaugeValue?: number;        // generic gauge (pressure, temp, conversion)
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

export type Drop = {
  id: string;
  position: { x: number; y: number };
  reagent: Reagent;
  concentration: number;
  color: string;
};

// Procedure List
// src/simulation/types.ts

// ----------------------------
// Task Types
// ----------------------------
export type TaskType =
  | "create"             // add equipment to scene
  | "connect"            // connect two pieces of equipment / pipe
  | "start_equipment"    // turn on compressor, heater, pump
  | "stop_equipment"     // turn off
  | "set_pressure"       // set target pressure (modal input)
  | "set_temperature"    // set target temperature (modal input)
  | "purge"              // purge a line / reactor
  | "monitor_until"      // monitor sensor until threshold
  | "collect"            // collect product / output
  | "observe";           // optional, for inspection steps

// ----------------------------
// Execution Types
// ----------------------------
export type ExecutionType =
  | "instant"      // happens immediately
  | "duration"     // timed, e.g., purge for 5 sec
  | "modal"        // requires user input, e.g., set pressure
  | "temp"         // gradual temperature changes
  | "continuous"   // ongoing, e.g., flow animation
  | "repeatable";  // repeated steps like adding material

// ----------------------------
// Completion Event Types
// ----------------------------
export type CompletionEventType =
  | "set_color"        // change color of SVG (flow, indicators)
  | "set_volume"       // fill gauge / tank / pipe
  | "set_visibility"       // fill gauge / tank / pipe
  | "show_animation"   // smoke, vapor, reaction animation
  | "animate_gauge"    // move needle on pressure/temp gauge
  | "set_status_light" // turn green/yellow/red
  | "emit_message";    // textual feedback to user

// ----------------------------
// Completion Event Interfaces
// ----------------------------
export interface BaseCompletionEvent {
  type: CompletionEventType;
}

export interface SetColorEvent extends BaseCompletionEvent {
  type: "set_color";
  labitem: string;      // equipment id
  color: string;        // SVG color
  chemical?: string;    // optional, for flow color
}

export interface SetVolumeEvent extends BaseCompletionEvent {
  type: "set_volume";
  labitem: string;      // tank / pipe / gauge
  volume: number;       // 0..1 fraction
}

export interface SetVisibilityEvent extends BaseCompletionEvent {
  type: "set_visibility";
  labitem: EquipmentType;
	targetitem: EquipmentType;
  visible: boolean;
}

export interface ShowAnimationEvent extends BaseCompletionEvent {
  type: "show_animation";
  target: string;       // equipment or pipe
  animation: string;    // e.g., "steam", "smoke", "bubbling"
}

export interface AnimateGaugeEvent extends BaseCompletionEvent {
  type: "animate_gauge";
  target: string;       // equipment id
  gauge: "temperature" | "pressure" | "conversion";
  value: number;        // current value
}

export interface SetStatusLightEvent extends BaseCompletionEvent {
  type: "set_status_light";
  target: string;       // equipment id
  status: "off" | "yellow" | "green" | "red";
}

export interface EmitMessageEvent extends BaseCompletionEvent {
  type: "emit_message";
  message: string;
  severity?: "info" | "warning" | "error";
}

export type CompletionEvent =
  | SetColorEvent
  | SetVolumeEvent
	| SetVisibilityEvent
  | ShowAnimationEvent
  | AnimateGaugeEvent
  | SetStatusLightEvent
  | EmitMessageEvent;

// ----------------------------
// Base Step Interface
// ----------------------------
export interface BaseStep {
  id: number;
  task: TaskType;
  execution: ExecutionType;
  pre: number[];                     // prerequisite step ids
  completionEvents?: CompletionEvent[];
  errorMessage?: EmitMessageEvent;
  hint?: string;
  progressId?: string;
}

// ----------------------------
// Task-specific Step Interfaces
// ----------------------------
export interface CreateStep extends BaseStep {
  task: "create";
  execution: "instant";
  labitem: string;                  // equipment id
  params?: Record<string, any>;     // e.g., subtype, name
}

export interface ConnectStep extends BaseStep {
  task: "connect";
  execution: "instant";
  params: { from: string; to: string; via?: string }; // equipment/valve ids
}

export interface StartStopStep extends BaseStep {
  task: "start_equipment" | "stop_equipment";
  execution: "instant";
  target: string;                  // equipment id
}

export interface SetPressureStep extends BaseStep {
  task: "set_pressure";
  execution: "modal";
  target: string;                  // equipment id
  params: { setpoint: number };
}

export interface SetTemperatureStep extends BaseStep {
  task: "set_temperature";
  execution: "modal" | "temp";
  target: string;                  // equipment id
	startTemperature: number;
  targetTemperature: number;
  params: { setpoint: number };
}

export interface PurgeStep extends BaseStep {
  task: "purge";
  execution: "duration";
  target: string;                  // equipment id
  params: { duration: number };    // seconds
}

export interface MonitorUntilStep extends BaseStep {
  task: "monitor_until";
  execution: "duration";
  params: { sensor: string; threshold: number; timeout?: number };
}

export interface CollectStep extends BaseStep {
  task: "collect";
  execution: "instant";
  target: string;                  // equipment id
  params: { destination: string };
}

export interface TemporaryStep extends BaseStep {
  task: "collect";
  execution: "repeatable";
  target: string;                  // equipment id
  params: { destination: string };
}

export interface Temporary2Step extends BaseStep {
  task: "collect";
  execution: "continuous";
  target: string;                  // equipment id
  params: { destination: string };
}

// ----------------------------
// Unified Step Type
// ----------------------------
export type Step =
  | CreateStep
  | ConnectStep
  | StartStopStep
  | SetPressureStep
  | SetTemperatureStep
  | PurgeStep
  | MonitorUntilStep
  | CollectStep
  | Temporary2Step
	| TemporaryStep;

// ----------------------------
// Step Execution State Types
// ----------------------------
export type Status = "not_started" | "in_progress" | "completed";

export interface BaseStepCompletionState {
  stepId: number;
  task: TaskType;
  execution: ExecutionType;
  status: Status;
}

export interface CountCompletionState extends BaseStepCompletionState {
  execution: "repeatable";
  doneCount: number;
  completionCount: number;
}

export interface TimeCompletionState extends BaseStepCompletionState {
  execution: "duration";
  elapsedTime: number;
  completionTime: number;
}

export interface HeatCompletionState extends BaseStepCompletionState {
  execution: "temp";
  currentTemp: number;
  completionTemp: number;
}

export type StepCompletionState =
  | BaseStepCompletionState
  | CountCompletionState
  | TimeCompletionState
  | HeatCompletionState;

// ----------------------------
// User Action & Ingest Result
// ----------------------------
export interface UserAction {
  task: TaskType;
  execution: ExecutionType;
  labitem?: string;
  target?: string;
  source?: string;
  sourcechemical?: string;
  reagent?: string;
  volume?: number;
  temperatureDelta?: number;
  [key: string]: any;
}

export interface IngestResult {
  valid: boolean;
  matchedStep?: Step;
  remaining?: number;
  progressId?: string;
  message?: string;
  completed?: boolean;
  completionEvents?: CompletionEvent[];
  updatedCompletionState: Map<number, StepCompletionState>;
  updatedUserSteps: Step[];
}

export interface UIHandlers {
  emitMessage?: (title: string, description?: string, variant?: "default" | "destructive") => void;
}

// ----------------------------
// Procedure Type
// ----------------------------
export interface Procedure {
  id: string;
  name: string;
  steps: Step[];
}
