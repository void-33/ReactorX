'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { sampleExperiment } from '@/lib/experiments';
import type { LabItem, EquipmentType, Reagent, ExperimentStep, Drop } from '@/lib/types';
import Header from '@/components/lab/Header';
import Workbench from '@/components/lab/Workbench';
import EquipmentPanel from '@/components/lab/EquipmentPanel';
import ExperimentPanel from '@/components/lab/ExperimentPanel';
import { getGuidance, analyzeCompletion } from './actions';
import { useToast } from '@/hooks/use-toast';
import AnalysisDialog from '@/components/lab/AnalysisDialog';

// Elbow snapping configuration - adjust these for fine-tuning
// === STORAGE TANK SNAPPING CONFIGS ===
// Configuration for rotation = 0 (outlets at bottom and right)
const ELBOW_TANK_SNAP_CONFIG_ROTATION_0 = {
  snapDistance: 80, // Distance threshold for snapping (in pixels)
  storageTopOffsetX: 130, // Horizontal offset from StorageTank left edge to center top
  storageTopOffsetY: -80, // Vertical offset from StorageTank top edge (negative = above)
  // Micro-adjustment offsets - change these to fine-tune the elbow position
  microAdjustX: 60, // Additional horizontal adjustment
  microAdjustY: -10, // Additional vertical adjustment
};

// Configuration for rotation = 90 (outlets at bottom and left)
const ELBOW_TANK_SNAP_CONFIG_ROTATION_90 = {
  snapDistance: 150, // Distance threshold for snapping (in pixels)
  storageTopOffsetX: 130, // Horizontal offset from StorageTank left edge to center top
  storageTopOffsetY: -80, // Vertical offset from StorageTank top edge (negative = above)
  // Micro-adjustment offsets - change these to fine-tune the elbow position
  microAdjustX: -38, // Additional horizontal adjustment
  microAdjustY: 0, // Additional vertical adjustment
};

// === PIPE SNAPPING CONFIGS ===
// Bounding box dimensions for collision detection
const ELBOW_BBOX = { width: 120, height: 120 }; // Elbow bounding box size
const PIPE_BBOX = { width: 200, height: 200 };   // Pipe bounding box size

// Nested config for all 16 combinations: [elbowRotation][pipeRotation]
const ELBOW_PIPE_SNAP_CONFIGS = {
  0: { // Elbow rotation 0 (outlets: bottom, right)
    0: { pipeOffsetX: -5, pipeOffsetY: -140, microAdjustX: 0, microAdjustY: 0 },     // Pipe rotation 0
    90: { pipeOffsetX: -215, pipeOffsetY: 70, microAdjustX: 0, microAdjustY: 0 },    // Pipe rotation 90
    180: { pipeOffsetX: -5, pipeOffsetY: -140, microAdjustX: 0, microAdjustY: 0 },   // Pipe rotation 180
    270: { pipeOffsetX: -220, pipeOffsetY: 70, microAdjustX: 0, microAdjustY: 0 },   // Pipe rotation 270
  },
  90: { // Elbow rotation 90 (outlets: bottom, left)
    0: { pipeOffsetX: -104, pipeOffsetY: -140, microAdjustX: 0, microAdjustY: 0 },     // Pipe rotation 0
    90: { pipeOffsetX: 115, pipeOffsetY: 81, microAdjustX: 0, microAdjustY: 0 },    // Pipe rotation 90
    180: { pipeOffsetX: -103, pipeOffsetY: -140, microAdjustX: 0, microAdjustY: 0 },   // Pipe rotation 180
    270: { pipeOffsetX: 120, pipeOffsetY: 81, microAdjustX: 0, microAdjustY: 0 },   // Pipe rotation 270
  },
  180: { // Elbow rotation 180 (outlets: top, left)
    0: { pipeOffsetX: -115, pipeOffsetY: +200, microAdjustX: 0, microAdjustY: 0 },     // Pipe rotation 0
    90: { pipeOffsetX: 105, pipeOffsetY: -19, microAdjustX: 0, microAdjustY: 0 },    // Pipe rotation 90
    180: { pipeOffsetX: -115, pipeOffsetY: 200, microAdjustX: 0, microAdjustY: 0 },   // Pipe rotation 180
    270: { pipeOffsetX: 107, pipeOffsetY: -17, microAdjustX: 0, microAdjustY: 0 },   // Pipe rotation 270
  },
  270: { // Elbow rotation 270 (outlets: top, right)
    0: { pipeOffsetX: -17, pipeOffsetY: 190, microAdjustX: 0, microAdjustY: 0 },     // Pipe rotation 0
    90: { pipeOffsetX: -240, pipeOffsetY: -31, microAdjustX: 0, microAdjustY: 0 },    // Pipe rotation 90
    180: { pipeOffsetX: -15, pipeOffsetY: 190, microAdjustX: 0, microAdjustY: 0 },   // Pipe rotation 180
    270: { pipeOffsetX: -237, pipeOffsetY: -30, microAdjustX: 0, microAdjustY: 0 },   // Pipe rotation 270
  },
};

export default function ChemSimLabPage() {
  const [labItems, setLabItems] = useState<LabItem[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepsTaken, setStepsTaken] = useState<ExperimentStep[]>([]);
  const [aiGuidance, setAiGuidance] = useState<{ guidance: string; isCorrect: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ isExperimentComplete: boolean; completionReason: string } | null>(null);
  const [lastInteractionToast, setLastInteractionToast] = useState<{title: string, description: string, variant?: "default" | "destructive" } | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [drops, setDrops] = useState<Drop[]>([]);
  // Track snapped connections: key is item ID, value is connected item ID
  const [snappedConnections, setSnappedConnections] = useState<Map<string, string>>(new Map());
  
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
      ...(type === 'beaker' || type === 'flask' || type === 'burette' ? { contents: { reagent: null, volume: 0, color: 'transparent', concentration: 0.1 } } : {}),
      ...(type === 'burner' ? { isHeating: false } : {}),
      ...(type === 'pipe' || type === 'elbow' ? { rotation: 0 } : {}),
    };
    setLabItems((prev) => [...prev, newItem]);
  };

  const removeLabItem = (itemId: string) => {
    setLabItems((prev) => prev.filter(item => item.id !== itemId));
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    }
    // Clear any connections for this item
    setSnappedConnections(prev => {
      const newMap = new Map(prev);
      const connectedId = newMap.get(itemId);
      if (connectedId) {
        newMap.delete(connectedId);
      }
      newMap.delete(itemId);
      return newMap;
    });
    setLastInteractionToast({ title: "Item Removed", description: "Equipment removed from workbench."});
  };

  const rotatePipe = (itemId: string) => {
    // Clear any connections when rotating since position will change
    setSnappedConnections(prev => {
      const newMap = new Map(prev);
      const connectedId = newMap.get(itemId);
      if (connectedId) {
        newMap.delete(connectedId);
      }
      newMap.delete(itemId);
      return newMap;
    });
    
    setLabItems((prev) => prev.map(item => {
      if (item.id === itemId && (item.type === 'pipe' || item.type === 'elbow')) {
        return { ...item, rotation: ((item.rotation || 0) + 90) % 360 };
      }
      return item;
    }));
  };
  
  const addReagentToItem = (itemId: string, reagent: Reagent, volume: number, concentration: number) => {
    setLabItems(prevItems => prevItems.map(item => {
      if (item.id === itemId && item.contents) {
        // if(item.contents.volume > 0 && item.contents.reagent?.id !== reagent.id) {
        //     setLastInteractionToast({ title: 'Mixing not implemented', description: 'This simulation does not support mixing different reagents yet.', variant: 'destructive'});
        //     return item;
        // }
				let found: boolean = false;
				let indicator : boolean = reagent.id === 'phenolphthalein';
				const newChemicals = item.chemicals.map(chemical => {
					if (chemical.reagent.id === 'phenolphthalein') indicator = true;
					if (chemical.reagent.id === reagent.id) {
						found = true;
						const newConcentration = (chemical.concentration * chemical.volume + volume * concentration) / (chemical.volume + volume);
						return { ...chemical, volume: chemical.volume + volume, concentration: newConcentration };
					}
					return chemical;
				})
				const finalChemicals = found ? newChemicals : [...item.chemicals, { reagent, volume, concentration }];
        const newVolume = item.contents.volume + volume;
				let molesOfHydrogen : number = 0;
				item.chemicals.forEach(chemical => {
					if (chemical.reagent.id === 'hcl') {
						molesOfHydrogen += chemical.volume * chemical.concentration;
					}
					else if (chemical.reagent.id === 'naoh') {
						molesOfHydrogen -= chemical.volume * chemical.concentration;
					}
				})
				molesOfHydrogen /= 1000;
				const ph = (molesOfHydrogen === 0) ? 7 : ((molesOfHydrogen > 0) ? -Math.log10(molesOfHydrogen) : 14 + Math.log10(-molesOfHydrogen));
				let newColor = reagent.color;
				if (indicator) {
					if (ph >= 10) newColor = "#ff0000ff";
					else if (ph >= 8.2) newColor = "#AA336Aff";
					else newColor = "#ffffffff";
				}
        return { ...item, contents: { reagent, volume: newVolume, color: newColor, concentration }, chemicals: finalChemicals };
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

  const handleWorkbenchClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setSelectedItemId(null);
      setLabItems((prev) =>
        prev.map((item) => ({ ...item, isSelected: false }))
      );
    }
  };

  const handleDragEnd = (id: string, info: PanInfo) => {
    const draggedItem = labItems.find(item => item.id === id);
    if (!draggedItem) return;

    let finalX = draggedItem.position.x + info.offset.x;
    let finalY = draggedItem.position.y + info.offset.y;

    // Check for elbow snapping to storage tank (only for rotation 0 and 90)
    if (draggedItem.type === 'elbow' && (draggedItem.rotation === 0 || draggedItem.rotation === 90)) {
      const storageTank = labItems.find(item => item.type === 'storagetank');
      if (storageTank) {
        const storageTankRef = itemRefs.current.get(storageTank.id);
        if (storageTankRef && workbenchRef.current) {
          const storageRect = storageTankRef.getBoundingClientRect();
          const workbenchRect = workbenchRef.current.getBoundingClientRect();
          
          // Select the appropriate config based on elbow rotation
          const ELBOW_SNAP_CONFIG = draggedItem.rotation === 90 
            ? ELBOW_TANK_SNAP_CONFIG_ROTATION_90 
            : ELBOW_TANK_SNAP_CONFIG_ROTATION_0;
          
          // Calculate storage tank's top-middle position in workbench coordinates
          const storageTankTopX = storageTank.position.x + ELBOW_SNAP_CONFIG.storageTopOffsetX;
          const storageTankTopY = storageTank.position.y + ELBOW_SNAP_CONFIG.storageTopOffsetY;
          
          // Calculate distance between elbow center and storage tank top
          const elbowCenterX = finalX + 60; // Approximate elbow center
          const elbowCenterY = finalY + 60;
          const distance = Math.sqrt(
            Math.pow(elbowCenterX - storageTankTopX, 2) + 
            Math.pow(elbowCenterY - storageTankTopY, 2)
          );
          
          // Snap if within threshold
          if (distance < ELBOW_SNAP_CONFIG.snapDistance) {
            finalX = storageTankTopX - 60 + ELBOW_SNAP_CONFIG.microAdjustX; // Center elbow on snap point
            finalY = storageTankTopY - 60 + ELBOW_SNAP_CONFIG.microAdjustY;
            setLastInteractionToast({ 
              title: "Elbow Snapped", 
              description: "Elbow attached to storage tank top."
            });
          }
        }
      }
    }

    // Check for elbow-to-pipe or pipe-to-elbow snapping
    if (draggedItem.type === 'elbow' || draggedItem.type === 'pipe') {
      const targetType = draggedItem.type === 'elbow' ? 'pipe' : 'elbow';
      const targetItem = labItems.find(item => item.type === targetType);
      
      if (targetItem) {
        const targetRef = itemRefs.current.get(targetItem.id);
        if (targetRef && workbenchRef.current) {
          // Get both rotations - default to 0 if not set
          const elbowRotation = (draggedItem.type === 'elbow' ? draggedItem.rotation : targetItem.rotation) || 0;
          const pipeRotation = (draggedItem.type === 'pipe' ? draggedItem.rotation : targetItem.rotation) || 0;
          
          // Get the appropriate config for this combination
          const pipeSnapConfig = ELBOW_PIPE_SNAP_CONFIGS[elbowRotation]?.[pipeRotation] || ELBOW_PIPE_SNAP_CONFIGS[0][0];
          
          // Determine which item is elbow and which is pipe
          const elbowItem = draggedItem.type === 'elbow' ? draggedItem : targetItem;
          const pipeItem = draggedItem.type === 'pipe' ? draggedItem : targetItem;
          
          // Calculate current positions
          const elbowX = draggedItem.type === 'elbow' ? finalX : elbowItem.position.x;
          const elbowY = draggedItem.type === 'elbow' ? finalY : elbowItem.position.y;
          const pipeX = draggedItem.type === 'pipe' ? finalX : pipeItem.position.x;
          const pipeY = draggedItem.type === 'pipe' ? finalY : pipeItem.position.y;
          
          // Create bounding boxes for collision detection
          const elbowRect = {
            x: elbowX,
            y: elbowY,
            width: ELBOW_BBOX.width,
            height: ELBOW_BBOX.height
          };
          
          const pipeRect = {
            x: pipeX,
            y: pipeY,
            width: PIPE_BBOX.width,
            height: PIPE_BBOX.height
          };
          
          // Check if rectangles overlap (AABB collision detection)
          const isOverlapping = (
            elbowRect.x < pipeRect.x + pipeRect.width &&
            elbowRect.x + elbowRect.width > pipeRect.x &&
            elbowRect.y < pipeRect.y + pipeRect.height &&
            elbowRect.y + elbowRect.height > pipeRect.y
          );
          
          const wasConnected = snappedConnections.has(draggedItem.id) && snappedConnections.get(draggedItem.id) === targetItem.id;
          
          // Snap if rectangles are overlapping
          if (isOverlapping) {
            // Calculate pipe snap position
            const pipeSnapX = pipeItem.position.x + pipeSnapConfig.pipeOffsetX;
            const pipeSnapY = pipeItem.position.y + pipeSnapConfig.pipeOffsetY;
            if (draggedItem.type === 'elbow') {
              finalX = pipeSnapX + pipeSnapConfig.microAdjustX;
              finalY = pipeSnapY + pipeSnapConfig.microAdjustY;
            } else {
              // If dragging pipe, snap to elbow
              finalX = elbowItem.position.x - pipeSnapConfig.pipeOffsetX + pipeSnapConfig.microAdjustX;
              finalY = elbowItem.position.y - pipeSnapConfig.pipeOffsetY + pipeSnapConfig.microAdjustY;
            }
            
            // Only show toast if newly connected (not already snapped)
            if (!wasConnected) {
              setSnappedConnections(prev => {
                const newMap = new Map(prev);
                newMap.set(draggedItem.id, targetItem.id);
                newMap.set(targetItem.id, draggedItem.id);
                return newMap;
              });
              setLastInteractionToast({ 
                title: "Pipe Connected", 
                description: `Elbow(${elbowRotation}°) + Pipe(${pipeRotation}°) connected.`
              });
            }
          } else {
            // Unsnap if moved beyond threshold
            if (wasConnected) {
              setSnappedConnections(prev => {
                const newMap = new Map(prev);
                newMap.delete(draggedItem.id);
                newMap.delete(targetItem.id);
                return newMap;
              });
              setLastInteractionToast({ 
                title: "Pipe Disconnected", 
                description: "Items unsnapped."
              });
            }
          }
        }
      }
    }

    // Update position
    updateItemPosition(id, finalX, finalY);

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

  const handleDropReagent = () => {
    const selectedItem = labItems.find(item => item.id === selectedItemId);
    if (!selectedItem || selectedItem.type !== 'burette' || !selectedItem.contents || selectedItem.contents.volume < 2) {
      setLastInteractionToast({ title: 'Cannot Drop', description: 'Burette must have at least 2ml of reagent.', variant: 'destructive' });
      return;
    }

    // Remove 2ml from burette
    setLabItems(prev => prev.map(item => {
      if (item.id === selectedItemId && item.contents) {
        return { ...item, contents: { ...item.contents, volume: item.contents.volume - 2 } };
      }
      return item;
    }));

    // Create a drop at the burette position (bottom of burette)
    const dropId = `drop-${Date.now()}`;
    const newDrop: Drop = {
      id: dropId,
      position: { x: selectedItem.position.x + 50, y: selectedItem.position.y + 380 }, // Bottom of burette
      reagent: selectedItem.contents.reagent!,
      concentration: selectedItem.contents.concentration,
      color: selectedItem.contents.color
    };

    setDrops(prev => [...prev, newDrop]);

    // Animate the drop falling
    const fallInterval = setInterval(() => {
      setDrops(prevDrops => {
        const drop = prevDrops.find(d => d.id === dropId);
        if (!drop) {
          clearInterval(fallInterval);
          return prevDrops;
        }

        // Check collision with flasks
        let collided = false;
        labItems.forEach(item => {
          if (item.type === 'flask' && item.contents) {
            const itemRef = itemRefs.current.get(item.id);
            if (itemRef && workbenchRef.current) {
              const itemRect = itemRef.getBoundingClientRect();
              const workbenchRect = workbenchRef.current.getBoundingClientRect();
              
              // Check if drop position collides with flask's red rect
              const flaskRedRectX = item.position.x + 65; // bbox.x + 55, approximate
              const flaskRedRectY = item.position.y + 40; // bbox.y, approximate
              const flaskRedRectWidth = 45;
              const flaskRedRectHeight = 160;

              if (
                drop.position.x >= flaskRedRectX &&
                drop.position.x <= flaskRedRectX + flaskRedRectWidth &&
                drop.position.y >= flaskRedRectY &&
                drop.position.y <= flaskRedRectY + flaskRedRectHeight
              ) {
                collided = true;
                // Add 2ml to flask
                addReagentToItem(item.id, drop.reagent, 2, drop.concentration);
                setLastInteractionToast({ title: 'Drop Added', description: `Added 2ml to ${item.type}.` });
              }
            }
          }
        });

        if (collided) {
          clearInterval(fallInterval);
          return prevDrops.filter(d => d.id !== dropId);
        }

        // Move drop down
        const updatedDrop = { ...drop, position: { ...drop.position, y: drop.position.y + 5 } };
        
        // Remove drop if it falls off screen
        if (updatedDrop.position.y > 800) {
          clearInterval(fallInterval);
          return prevDrops.filter(d => d.id !== dropId);
        }

        return prevDrops.map(d => d.id === dropId ? updatedDrop : d);
      });
    }, 30);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body">
      <Header onSave={() => console.log(JSON.stringify(labItems))} onReset={handleReset} />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden">
        <div className="lg:col-span-3 xl:col-span-2">
          <ExperimentPanel
            experiment={sampleExperiment}
            currentStepIndex={currentStepIndex}
            items={labItems}
            selectedItem={labItems.find(item => item.id === selectedItemId) || null}
            onAddReagent={addReagentToItem}
            onRemoveItem={removeLabItem}
            onGetGuidance={handleGetGuidance}
            onAnalyzeCompletion={handleAnalyzeCompletion}
            onDropReagent={handleDropReagent}
            aiGuidance={aiGuidance}
            isLoading={isLoading}
          />
        </div>
        
        <div className="lg:col-span-6 xl:col-span-8 h-full">
           <Workbench 
              ref={workbenchRef} 
              items={labItems}
              drops={drops}
              onDragEnd={handleDragEnd}
              onItemClick={handleItemClick}
               onWorkbenchClick={handleWorkbenchClick}
              onRemoveItem={removeLabItem}
              onRotatePipe={rotatePipe}
              itemRefs={itemRefs}
            />
        </div>
        
        <div className="lg:col-span-3 xl:col-span-2">
          <EquipmentPanel onAddItem={addLabItem} />
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
