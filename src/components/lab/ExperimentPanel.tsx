'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, HelpCircle, Lightbulb, Loader, FlaskConical, AlertCircle, TestTube } from 'lucide-react';
import type { Experiment, LabItem, Reagent } from '@/lib/types';
import { Input } from '@/components/ui/input';

interface ExperimentPanelProps {
  experiment: Experiment;
  currentStepIndex: number;
  items: LabItem[];
  selectedItem: LabItem | null;
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
  selectedItem,
  onAddReagent,
  onGetGuidance,
  onAnalyzeCompletion,
  aiGuidance,
  isLoading,
}: ExperimentPanelProps) {
  const [selectedReagentId, setSelectedReagentId] = useState<string>('');
  const [selectedVolume, setSelectedVolume] = useState<number>(50);

  const containerItems = items.filter(item => item.contents);
  const selectedReagent = experiment.reagents.find(r => r.id === selectedReagentId);

  const handleAddReagent = () => {
    if (selectedItem && selectedReagent) {
      onAddReagent(selectedItem.id, selectedReagent, selectedVolume);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{experiment.name}</CardTitle>
        <CardDescription>{experiment.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        
        
				<div className={`p-3 rounded-md border-2 ${selectedItem ? 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700' : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700'}`}>
					<p className={`text-xs font-semibold mb-1 ${selectedItem ? 'text-green-900 dark:text-green-100' : 'text-yellow-900 dark:text-yellow-100'}`}>
						{selectedItem ? '✓ Equipment Selected' : '⚠ No Equipment Selected'}
					</p>
					<p className={`text-sm font-semibold ${selectedItem ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'}`}>
						{selectedItem ? (
							<>
								<span className="block">{selectedItem.type.toUpperCase()}</span>
								{selectedItem.contents && (
									<>
										<span className="text-xs mt-1 mr-4">Volume: {selectedItem.contents.volume.toFixed(1)}ml</span>
									</>
								)}
							</>
						) : (
							'Select equipment from the workbench.'
						)}
					</p>
				</div>

        <Separator />

        <div>
            <h3 className="font-semibold mb-2 text-sm">Add Reagents</h3>
            <div className="space-y-2">
                <Select value={selectedReagentId} onValueChange={setSelectedReagentId}>
                    <SelectTrigger><SelectValue placeholder="Select Reagent" /></SelectTrigger>
                    <SelectContent>
                        {experiment.reagents.map(reagent => (
                            <SelectItem key={reagent.id} value={reagent.id}>{reagent.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Input
                      type="number"
                      placeholder="Volume (ml)"
                      value={selectedVolume}
                      onChange={(e) => setSelectedVolume(Number(e.target.value))}
                      min="1"
                      className="w-full"
                  />
                  <span>ml</span>
                </div>
                
                <Button onClick={handleAddReagent} disabled={!selectedItem || !selectedReagentId || selectedVolume <= 0} className="w-full">
                    Add {selectedVolume}ml
                </Button>
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
