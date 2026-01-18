import { HeatCompletionState, Step, StepCompletionState, } from "@/lib/types"
/**
 * Initialize a completion state object for a given procedure list.
 * Returns a Map of stepId → StepCompletionState
 */
export function initializeCompletionState(procedure: Step[]): Map<number, StepCompletionState> {
  const state = new Map<number, StepCompletionState>();

  procedure.forEach((step) => {
    switch (step.execution) {
      case "instant":
        state.set(step.id, {
          stepId: step.id,
          task: step.task,
          execution: step.execution,
          status: "not_started",
        });
        break;

      case "repeatable":
        const repeatableStep = step as any; // DropStep
        state.set(step.id, {
          stepId: step.id,
          task: step.task,
          execution: step.execution,
          status: "not_started",
          doneCount: 0,
          completionCount: repeatableStep.completionCount ?? 1,
        });
        break;

      // case "duration":
      //   const durationStep = step as any; // HeatStep, etc.
      //   state.set(step.id, {
      //     stepId: step.id,
      //     task: step.task,
      //     execution: step.execution,
      //     status: "not_started",
      //     elapsedTime: 0,
			// 		completionTime: durationStep.durationSec
      //   });
      //   break;

			case "temp":
				state.set(step.id, {
					stepId: step.id,
					task: step.task,
					execution: "temp",
					currentTemp: step.startTemperature,
					completionTemp: step.targetTemperature,
					status: "not_started",
				});
				break;

      default:
				const defStep = step as any;
        state.set(defStep.id, {
          stepId: defStep.id,
          task: defStep.task,
          execution: defStep.execution,
          status: "not_started",
				});
        console.log("Type doesnt exist");
        break;
    }
  });

  return state;
}
