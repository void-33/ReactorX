import {
  UserAction,
  Step,
  StepCompletionState,
  CountCompletionState,
  TimeCompletionState,
  HeatCompletionState,
  UIHandlers,
  IngestResult,
  BaseStepCompletionState,
} from "@/lib/types";

/**
 * ingestUserAction: validates a user action against the SOP procedure
 * and returns updated completion state + any triggered completion events.
 */
export function ingestUserAction(
  action: UserAction,
  procedure: Step[],
  completionState: Map<number, StepCompletionState>,
  userSteps: Step[],
  ui: UIHandlers,
): IngestResult {
  try {
    // 1️⃣ Filter candidate steps whose preconditions are satisfied
    const candidates = procedure.filter(
      (step) =>
        step.task === action.task &&
        (step.pre || []).every(
          (pid) => completionState.get(pid)?.status === "completed"
        ) &&
        completionState.get(step.id)?.status !== "completed"
    );

    if (candidates.length === 0) {
      const msg = "This step cannot be performed yet (preconditions not satisfied).";
      ui?.emitMessage?.("Cannot perform step", msg, "destructive");
      return {
        valid: false,
        message: msg,
        updatedCompletionState: new Map(completionState),
        updatedUserSteps: [...userSteps],
      };
    }

    // 2️⃣ Match a candidate step
    const matched = candidates.find((step) => {
      switch (step.task) {
        case "create":
          return (step as any).labitem === action.labitem;
        case "connect":
          return (
            (step as any).params?.from === action.source &&
            (step as any).params?.to === action.target
          );
        case "start_equipment":
        case "stop_equipment":
          return (step as any).target === action.target;
        case "set_pressure":
        case "set_temperature":
          return (step as any).target === action.target;
        case "purge":
        case "monitor_until":
        case "collect":
          return (step as any).target === action.target;
        default:
          return false;
      }
    });

    if (!matched) {
      const fallback = candidates[0]?.errorMessage?.message ?? "Incorrect operation for this step.";
      ui?.emitMessage?.("Step invalid", fallback, "destructive");
      return {
        valid: false,
        message: fallback,
        updatedCompletionState: new Map(completionState),
        updatedUserSteps: [...userSteps],
      };
    }

    // 3️⃣ Clone state & userSteps
    const newCompletionState = new Map(completionState);
    const newUserSteps = [...userSteps];
    let stateEntry = newCompletionState.get(matched.id)!;
    const persistState = () => newCompletionState.set(matched.id, stateEntry);

    // 4️⃣ Handle by execution type
    switch (matched.execution) {
      case "instant":
      case "modal":
        stateEntry.status = "completed";
        persistState();
        newUserSteps.push({ ...matched });
        ui?.emitMessage?.("Step completed", `${matched.task} done.`, "default");
        return {
          valid: true,
          matchedStep: matched,
          message: "Step completed",
          updatedCompletionState: newCompletionState,
          updatedUserSteps: newUserSteps,
          ...(matched.completionEvents && { completionEvents: matched.completionEvents }),
          ...(matched.progressId && { progressId: matched.progressId }),
        };

      case "repeatable": {
        const countState = stateEntry as CountCompletionState;
        const contribution = 1;
        countState.doneCount += contribution;
        if (countState.doneCount >= countState.completionCount) {
          countState.doneCount = countState.completionCount;
          countState.status = "completed";
          ui?.emitMessage?.("Step completed", `${matched.task} done.`, "default");
        } else {
          countState.status = "in_progress";
          ui?.emitMessage?.(
            "Progress recorded",
            `${countState.doneCount}/${countState.completionCount}`,
            "default"
          );
        }
        persistState();
        newUserSteps.push({ ...matched });
        const remaining = Math.max(0, countState.completionCount - countState.doneCount);
        return {
          valid: true,
          matchedStep: matched,
          remaining,
          message: countState.status === "completed" ? "Step completed" : "Progress recorded",
          updatedCompletionState: newCompletionState,
          updatedUserSteps: newUserSteps,
          ...(matched.completionEvents && countState.status === "completed" && { completionEvents: matched.completionEvents }),
          ...(matched.progressId && { progressId: matched.progressId }),
        };
      }

      case "duration": {
        const timeState = stateEntry as TimeCompletionState;
        // TODO: implement time-based actions, e.g., purge, monitoring
        // Example: timeState.elapsedTime += action.elapsedTime ?? 0;
        // Mark as completed if elapsedTime >= completionTime
        // Emit message + handle completionEvents
        return {
          valid: false,
          message: "Duration steps not yet implemented",
          updatedCompletionState: newCompletionState,
          updatedUserSteps: newUserSteps,
        };
      }

      case "temp": {
        const tempState = stateEntry as HeatCompletionState;
        const deltaTemp = action.temperatureDelta ?? 0;
        // TODO: optionally handle industrial "set_temperature" step differently
        tempState.currentTemp = (tempState.currentTemp || 0) + deltaTemp;

        if (tempState.currentTemp >= tempState.completionTemp) {
          tempState.status = "completed";
          ui?.emitMessage?.("Temperature Step complete", `Target reached`, "default");
        } else {
          tempState.status = "in_progress";
          ui?.emitMessage?.(
            "Temperature in progress",
            `${tempState.currentTemp}/${tempState.completionTemp}`,
            "default"
          );
        }

        persistState();
        newUserSteps.push({ ...matched });

        return {
          valid: true,
          matchedStep: matched,
          completed: tempState.status === "completed",
          remaining: tempState.completionTemp - tempState.currentTemp,
          message: tempState.status === "completed" ? "Temperature reached" : "Heating/Cooling in progress",
          updatedCompletionState: newCompletionState,
          updatedUserSteps: newUserSteps,
          ...(matched.completionEvents && tempState.status === "completed" && { completionEvents: matched.completionEvents }),
          ...(matched.progressId && { progressId: matched.progressId }),
        };
      }

      case "continuous":
        // TODO: implement flow animation / ongoing process if needed
        return {
          valid: false,
          message: "Continuous steps not yet implemented",
          updatedCompletionState: newCompletionState,
          updatedUserSteps: newUserSteps,
        };
    }
  } catch (err) {
    ui?.emitMessage?.("Internal error", "Error processing action", "destructive");
    return {
      valid: false,
      message: "Internal error",
      updatedCompletionState: new Map(completionState),
      updatedUserSteps: [...userSteps],
    };
  }
}
