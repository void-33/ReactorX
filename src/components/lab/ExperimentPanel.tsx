'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, HelpCircle, Lightbulb, Loader, FlaskConical, AlertCircle } from 'lucide-react';
import type { Experiment, LabItem, Reagent } from '@/lib/types';

interface ExperimentPanelProps {
  experiment: Experiment;
  currentStepIndex: number;
  items: LabItem[];
  onAddReagent: (itemId: string, reagent: Reagent, volume: number) => void;
  onGetGuidance: () => void;
  onAnalyzeCompletion: () => void;
  aiGuidance: { guidance: string; isCorrect: boolean } | null;
  isLoading: boolean;
}

export default function ExperimentPanel({
  experiment,
  currentStepIndex,
  items,
  onAddReagent,
  onGetGuidance,
  onAnalyzeCompletion,
  aiGuidance,
  isLoading,
}: ExperimentPanelProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [selectedReagentId, setSelectedReagentId] = useState<string>('');

  const containerItems = items.filter(item => item.contents);
  const selectedReagent = experiment.reagents.find(r => r.id === selectedReagentId);

  const handleAddReagent = () => {
    if (selectedItemId && selectedReagent) {
      onAddReagent(selectedItemId, selectedReagent, 50); // Add 50ml by default
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{experiment.name}</CardTitle>
        <CardDescription>{experiment.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div>
            <h3 className="font-semibold mb-2 text-sm">Add Reagents</h3>
            <div className="space-y-2">
                <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                    <SelectTrigger><SelectValue placeholder="Select Container" /></SelectTrigger>
                    <SelectContent>
                        {containerItems.length > 0 ? containerItems.map(item => (
                            <SelectItem key={item.id} value={item.id}>{item.type} ({item.id.slice(-4)})</SelectItem>
                        )) : <SelectItem value="none" disabled>No containers</SelectItem>}
                    </SelectContent>
                </Select>
                <Select value={selectedReagentId} onValueChange={setSelectedReagentId}>
                    <SelectTrigger><SelectValue placeholder="Select Reagent" /></SelectTrigger>
                    <SelectContent>
                        {experiment.reagents.map(reagent => (
                            <SelectItem key={reagent.id} value={reagent.id}>{reagent.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleAddReagent} disabled={!selectedItemId || !selectedReagentId} className="w-full">Add 50ml</Button>
            </div>
        </div>
        <Separator />
        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="font-semibold mb-2 text-sm">Procedure</h3>
          <ScrollArea className="flex-1 pr-4">
            <ul className="space-y-3">
              {experiment.steps.map((step, index) => (
                <li key={step.id} className="flex items-start gap-3">
                  <div className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-primary-foreground ${index < currentStepIndex ? 'bg-primary' : index === currentStepIndex ? 'bg-primary/70 animate-pulse' : 'bg-muted-foreground/30'}`}>
                    {index < currentStepIndex ? <CheckCircle className="h-4 w-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                  </div>
                  <span className={`text-sm ${index === currentStepIndex ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{step.instruction}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
        {aiGuidance && (
          <Alert variant={aiGuidance.isCorrect ? "default" : "destructive"} className="mt-4">
            {aiGuidance.isCorrect ? <Lightbulb className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{aiGuidance.isCorrect ? "Guidance" : "Correction Needed"}</AlertTitle>
            <AlertDescription>{aiGuidance.guidance}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" onClick={onGetGuidance} className="w-full" disabled={isLoading}>
          {isLoading ? <Loader className="animate-spin mr-2" /> : <HelpCircle className="mr-2" />} Get Hint
        </Button>
        <Button onClick={onAnalyzeCompletion} className="w-full" disabled={isLoading}>
          {isLoading ? <Loader className="animate-spin mr-2" /> : <FlaskConical className="mr-2" />} Complete
        </Button>
      </CardFooter>
    </Card>
  );
}
