'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle } from "lucide-react";

interface AnalysisDialogProps {
  result: {
    isExperimentComplete: boolean;
    completionReason: string;
  };
  onOpenChange: (open: boolean) => void;
}

export default function AnalysisDialog({ result, onOpenChange }: AnalysisDialogProps) {
  return (
    <AlertDialog open={true} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            {result.isExperimentComplete ? (
              <CheckCircle className="w-16 h-16 text-green-500" />
            ) : (
              <XCircle className="w-16 h-16 text-destructive" />
            )}
          </div>
          <AlertDialogTitle className="text-center">
            {result.isExperimentComplete ? "Experiment Complete!" : "Experiment Incomplete"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center pt-2">
            {result.completionReason}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
