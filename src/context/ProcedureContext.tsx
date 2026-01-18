"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { Step, StepCompletionState, Procedure, UIHandlers, LabItem } from "@/lib/types";
import { initializeCompletionState } from "@/procedures/initializeCompletionState";
import { procedures } from "@/procedures/list"; // your list
import { useToast } from "@/hooks/use-toast";

interface ProcedureContextType {
	guided: boolean;
	setGuided: React.Dispatch<React.SetStateAction<boolean>>;
  procedures: Procedure[];
  procedureIndex: number;
  setProcedureIndex: (i: number) => void;
  procedure: Procedure;
  labItems: LabItem[];
  setLabItems: React.Dispatch<React.SetStateAction<LabItem[]>>;

  completionState: Map<number, StepCompletionState>;
  setCompletionState: React.Dispatch<
    React.SetStateAction<Map<number, StepCompletionState>>
  >;

  userSteps: Step[];
  setUserSteps: React.Dispatch<React.SetStateAction<Step[]>>;

  ui: UIHandlers;
}

const ProcedureContext = createContext<ProcedureContextType | null>(null);

export const ProcedureProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const [lastInteractionToast, setLastInteractionToast] = useState<{
    title: string;
    description: string;
    variant?: "default" | "destructive";
  } | null>(null);

  useEffect(() => {
    if (lastInteractionToast) {
      setLastInteractionToast(null);
    }
  }, [lastInteractionToast, toast]);

	const [guided, setGuided] = useState<boolean>(false);
  const [procedureIndex, setProcedureIndex] = useState(0);
  const procedure = procedures[procedureIndex];
  const [labItems, setLabItems] = useState<LabItem[]>([]);
  const ui: UIHandlers = {
    emitMessage: (title, description = "", variant = "default") => {
      toast({ title, description, variant });
    },
  };

  const [completionState, setCompletionState] = useState<
    Map<number, StepCompletionState>
  >(() => initializeCompletionState(procedure.steps));

  const [userSteps, setUserSteps] = useState<Step[]>([]);

  // 🔁 Reset when procedure changes
  useEffect(() => {
    setCompletionState(initializeCompletionState(procedure.steps));
    setUserSteps([]);
  }, [procedureIndex, procedure.steps]);
		
  return (
    <ProcedureContext.Provider
      value={{
				guided, 
				setGuided,
        procedures,
        procedureIndex,
        setProcedureIndex,
        procedure,
        labItems,
        setLabItems,
        completionState,
        setCompletionState,
        userSteps,
        setUserSteps,
				ui
      }}
    >
      {children}
    </ProcedureContext.Provider>
  );
};

export const useProcedure = () => {
  const ctx = useContext(ProcedureContext);
  if (!ctx) {
    throw new Error("useProcedure must be used inside ProcedureProvider");
  }
  return ctx;
};
