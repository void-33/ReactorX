'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { sampleExperiment } from '@/lib/experiments';
import type { LabItem, EquipmentType, Reagent, ExperimentStep } from '@/lib/types';
import Header from '@/components/lab/Header';
import Workbench from '@/components/lab/Workbench';
import EquipmentPanel from '@/components/lab/EquipmentPanel';
import ExperimentPanel from '@/components/lab/ExperimentPanel';
import { getGuidance, analyzeCompletion } from './actions';
import { useToast } from '@/hooks/use-toast';
import AnalysisDialog from '@/components/lab/AnalysisDialog';

export default function ChemSimLabPage() {
  const [labItems, setLabItems] = useState<LabItem[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepsTaken, setStepsTaken] = useState<ExperimentStep[]>([]);
  const [aiGuidance, setAiGuidance] = useState<{ guidance: string; isCorrect: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ isExperimentComplete: boolean; completionReason: string } | null>(null);
  const [lastInteractionToast, setLastInteractionToast] = useState<{title: string, description: string} | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  const workbenchRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    if (lastInteractionToast) {
      toast(lastInteractionToast);
      setLastInteractionToast(null);
    }
  }, [lastInteractionToast, toast]);

  const addLabItem = (type: EquipmentType) => {
    const newItem: LabItem = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 200, y: 200 },
			chemicals: [],
      isDraggingEnabled: true,
      isSelected: false,
      ...(type === 'beaker' || type === 'flask' ? { contents: { reagent: null, volume: 0, color: 'transparent' } } : {}),
      ...(type === 'burner' ? { isHeating: false } : {}),
    };
    setLabItems((prev) => [...prev, newItem]);
  };
  
  const addReagentToItem = (itemId: string, reagent: Reagent, volume: number) => {
    setLabItems(prevItems => prevItems.map(item => {
      if (item.id === itemId && item.contents) {
        // if(item.contents.volume > 0 && item.contents.reagent?.id !== reagent.id) {
        //     setLastInteractionToast({ title: 'Mixing not implemented', description: 'This simulation does not support mixing different reagents yet.', variant: 'destructive'});
        //     return item;
        // }
				const finalChemicals = [...item.chemicals, { reagent, volume }];
        const newVolume = item.contents.volume + volume;
        return { ...item, contents: { reagent, volume: newVolume, color: reagent.color }, chemicals: finalChemicals };
      }
      return item;
    }));
    trackStep(sampleExperiment.steps[0]);
  };

  const updateItemPosition = (id: string, x: number, y: number) => {
    setLabItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, position: { x, y } } : item))
    );
  };

  const handleItemClick = (itemId: string) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;

    if (timeSinceLastClick < 300) {
      // Double click - disable dragging temporarily for precision selection
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      setLabItems((prev) =>
        prev.map((item) => 
          item.id === itemId ? { ...item, isDraggingEnabled: false } : item
        )
      );
      lastClickTimeRef.current = 0;
    } else {
      // Single click - select equipment
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      
      clickTimeoutRef.current = setTimeout(() => {
        setSelectedItemId(itemId);
        setLabItems((prev) =>
          prev.map((item) => ({ ...item, isSelected: item.id === itemId }))
        );
      }, 300);
      
      lastClickTimeRef.current = now;
    }
  };

  const handleDragEnd = (id: string, info: PanInfo) => {
    const draggedItem = labItems.find(item => item.id === id);
    if (!draggedItem) return;

    // Update position
    updateItemPosition(id, draggedItem.position.x + info.offset.x, draggedItem.position.y + info.offset.y);

    // Check for interactions
    checkForPour(draggedItem, info);
    checkForHeating(draggedItem, info);
  };
  
  const trackStep = (step: ExperimentStep) => {
    if (!stepsTaken.find(s => s.id === step.id)) {
      setStepsTaken(prev => [...prev, step]);
      if (currentStepIndex < sampleExperiment.steps.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  };

  const checkForPour = (draggedItem: LabItem, info: PanInfo) => {
    if (!draggedItem.contents || draggedItem.contents.volume === 0) return;

    const finalPoint = { x: draggedItem.position.x + info.offset.x + 50, y: draggedItem.position.y + info.offset.y + 50 }; // center of item

    labItems.forEach(targetItem => {
      if (targetItem.id === draggedItem.id || !targetItem.contents) return;

      const targetRef = itemRefs.current.get(targetItem.id);
      if (targetRef) {
        const rect = targetRef.getBoundingClientRect();
        const workbenchRect = workbenchRef.current?.getBoundingClientRect();
        if(!workbenchRect) return;

        if (
          finalPoint.x > rect.left - workbenchRect.left &&
          finalPoint.x < rect.right - workbenchRect.left &&
          finalPoint.y > rect.top - workbenchRect.top &&
          finalPoint.y < rect.bottom - workbenchRect.top
        ) {
          // Pour interaction
          setLabItems(prevItems => {
            const newItems = [...prevItems];
            const sourceIndex = newItems.findIndex(i => i.id === draggedItem.id);
            const targetIndex = newItems.findIndex(i => i.id === targetItem.id);

            const source = newItems[sourceIndex];
            const target = newItems[targetIndex];
            
            if (source.contents && target.contents) {
              if (target.contents.reagent && target.contents.reagent.id !== source.contents.reagent?.id) {
                // Simple color mixing for titration
                if((source.contents.reagent?.id === 'hcl' && target.contents.reagent?.id === 'naoh') || (source.contents.reagent?.id === 'naoh' && target.contents.reagent?.id === 'hcl')){
                    target.contents.color = '#FFB6C1'; // Pink for titration
                    trackStep(sampleExperiment.steps[2]);
                } else {
                   setLastInteractionToast({ title: 'Mixing not implemented', description: 'This simulation does not support complex mixing yet.', variant: 'destructive'});
                   return prevItems;
                }
              } else {
                target.contents.reagent = source.contents.reagent;
                target.contents.color = source.contents.color;
              }
              
              target.contents.volume += source.contents.volume;
              source.contents.volume = 0;
              
              newItems[sourceIndex] = source;
              newItems[targetIndex] = target;
              
              setLastInteractionToast({ title: "Pour Complete", description: `Poured into ${target.type}.`});
              trackStep(sampleExperiment.steps[0]);
            }
            return newItems;
          });
        }
      }
    });
  };
  
  const checkForHeating = (draggedItem: LabItem, info: PanInfo) => {
    if (!draggedItem.contents) return;

    const finalPoint = { x: draggedItem.position.x + info.offset.x + 50, y: draggedItem.position.y + info.offset.y + 100 }; // bottom of item

    labItems.forEach(targetItem => {
      if (targetItem.type !== 'burner') return;
      
      const targetRef = itemRefs.current.get(targetItem.id);
      if (targetRef) {
        const rect = targetRef.getBoundingClientRect();
        const workbenchRect = workbenchRef.current?.getBoundingClientRect();
        if(!workbenchRect) return;

        if (
          finalPoint.x > rect.left - workbenchRect.left &&
          finalPoint.x < rect.right - workbenchRect.left &&
          finalPoint.y > rect.top - workbenchRect.top &&
          finalPoint.y < rect.top - workbenchRect.top + 30 // Top part of the burner
        ) {
           setLabItems(prev => prev.map(item => {
               if(item.id === targetItem.id) return {...item, isHeating: true};
               if(item.id === draggedItem.id) return {...item, isHeating: true};
               return item;
           }));
           setLastInteractionToast({ title: "Heating", description: `Started heating the ${draggedItem.type}.`});
           trackStep(sampleExperiment.steps[3]);
           setTimeout(() => {
                setLabItems(prev => prev.map(item => ({...item, isHeating: false})));
           }, 5000);
        }
      }
    });
  };

  const handleReset = () => {
    setLabItems([]);
    setCurrentStepIndex(0);
    setStepsTaken([]);
    setAiGuidance(null);
    setAnalysisResult(null);
  };
  
  const handleGetGuidance = async () => {
    setIsLoading(true);
    setAiGuidance(null);
    const result = await getGuidance(sampleExperiment, sampleExperiment.steps[currentStepIndex], labItems);
    setAiGuidance(result);
    setIsLoading(false);
  };
  
  const handleAnalyzeCompletion = async () => {
    setIsLoading(true);
    const result = await analyzeCompletion(sampleExperiment, labItems, stepsTaken);
    setAnalysisResult(result);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body">
      <Header onSave={() => console.log(JSON.stringify(labItems))} onReset={handleReset} />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden">
        <div className="lg:col-span-3 xl:col-span-2">
          <EquipmentPanel onAddItem={addLabItem} />
        </div>
        
        <div className="lg:col-span-6 xl:col-span-8 h-full">
           <Workbench 
              ref={workbenchRef} 
              items={labItems}
              onDragEnd={handleDragEnd}
              onItemClick={handleItemClick}
              itemRefs={itemRefs}
            />
        </div>
        
        <div className="lg:col-span-3 xl:col-span-2">
          <ExperimentPanel
            experiment={sampleExperiment}
            currentStepIndex={currentStepIndex}
            items={labItems}
            selectedItem={labItems.find(item => item.id === selectedItemId) || null}
            onAddReagent={addReagentToItem}
            onGetGuidance={handleGetGuidance}
            onAnalyzeCompletion={handleAnalyzeCompletion}
            aiGuidance={aiGuidance}
            isLoading={isLoading}
          />
        </div>
      </main>
      {analysisResult && (
        <AnalysisDialog 
          result={analysisResult} 
          onOpenChange={() => setAnalysisResult(null)}
        />
      )}
    </div>
  );
}
