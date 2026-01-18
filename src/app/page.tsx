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
  // Track snapped connections: key is item ID, value is array of connected item IDs
  // For elbows, max 2 connections (one per outlet); for pipes, max 1 connection
  const [snappedConnections, setSnappedConnections] = useState<Map<string, string[]>>(new Map());
  
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
      const connectedIds = newMap.get(itemId) || [];
      // Remove this item from all connected items' connection lists
      for (const connectedId of connectedIds) {
        const conns = (newMap.get(connectedId) || []).filter(id => id !== itemId);
        if (conns.length > 0) newMap.set(connectedId, conns);
        else newMap.delete(connectedId);
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
      const connectedIds = newMap.get(itemId) || [];
      // Remove this item from all connected items' connection lists
      for (const connectedId of connectedIds) {
        const conns = (newMap.get(connectedId) || []).filter(id => id !== itemId);
        if (conns.length > 0) newMap.set(connectedId, conns);
        else newMap.delete(connectedId);
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
      // Get all potential target items (all pipes if dragging elbow, all elbows if dragging pipe)
      const targetItems = labItems.filter(item => item.type === targetType);
      
      // Check current connections for the dragged item
      const currentConnections = snappedConnections.get(draggedItem.id) || [];
      const maxConnections = draggedItem.type === 'elbow' ? 2 : 1;
      
      // Track which connections to remove
      const connectionsToRemove: string[] = [];
      
      // Try to find overlapping items and snap to the closest one
      let bestMatch: { item: LabItem; distance: number; isOverlapping: boolean } | null = null;
      
      for (const targetItem of targetItems) {
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
        
        if (isOverlapping) {
          // Calculate distance to find the closest overlapping item
          const centerX = (elbowX + elbowX + ELBOW_BBOX.width) / 2;
          const centerY = (elbowY + elbowY + ELBOW_BBOX.height) / 2;
          const targetCenterX = (pipeX + pipeX + PIPE_BBOX.width) / 2;
          const targetCenterY = (pipeY + pipeY + PIPE_BBOX.height) / 2;
          const distance = Math.sqrt(
            Math.pow(centerX - targetCenterX, 2) + 
            Math.pow(centerY - targetCenterY, 2)
          );
          
          if (!bestMatch || distance < bestMatch.distance) {
            bestMatch = { item: targetItem, distance, isOverlapping: true };
          }
        } else if (currentConnections.includes(targetItem.id)) {
          // If this item is currently connected but not overlapping, mark for disconnection
          connectionsToRemove.push(targetItem.id);
        }
      }
      
      // Process the best match (if any)
      if (bestMatch) {
        const targetItem = bestMatch.item;
        const targetConnections = snappedConnections.get(targetItem.id) || [];
        const targetMaxConnections = targetItem.type === 'elbow' ? 2 : 1;
        
        // Check if either item has reached max connections
        const draggedHasSpace = currentConnections.length < maxConnections;
        const targetHasSpace = targetConnections.length < targetMaxConnections;
        const alreadyConnected = currentConnections.includes(targetItem.id);
        
        // Get both rotations
        const elbowRotation = (draggedItem.type === 'elbow' ? draggedItem.rotation : targetItem.rotation) || 0;
        const pipeRotation = (draggedItem.type === 'pipe' ? draggedItem.rotation : targetItem.rotation) || 0;
        
        // Check if elbow already has a pipe with the same rotation
        const elbowItem = draggedItem.type === 'elbow' ? draggedItem : targetItem;
        const pipeItem = draggedItem.type === 'pipe' ? draggedItem : targetItem;
        const elbowConnections = snappedConnections.get(elbowItem.id) || [];
        
        let hasSameRotationPipe = false;
        if (!alreadyConnected) {
          // Check all connected pipes to this elbow for same rotation
          for (const connId of elbowConnections) {
            const connectedItem = labItems.find(item => item.id === connId);
            if (connectedItem && connectedItem.type === 'pipe') {
              const connectedPipeRotation = connectedItem.rotation || 0;
              if (connectedPipeRotation === pipeRotation) {
                hasSameRotationPipe = true;
                break;
              }
            }
          }
        }
        
        if (hasSameRotationPipe) {
          setLastInteractionToast({ 
            title: "Cannot Connect", 
            description: `Elbow already has a pipe with rotation ${pipeRotation}°. Each outlet can only have one pipe.`,
            variant: "destructive"
          });
        } else if ((draggedHasSpace && targetHasSpace) || alreadyConnected) {
          const pipeSnapConfig = ELBOW_PIPE_SNAP_CONFIGS[elbowRotation]?.[pipeRotation] || ELBOW_PIPE_SNAP_CONFIGS[0][0];
          
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
          
          // Only show toast if newly connected
          if (!alreadyConnected) {
            setSnappedConnections(prev => {
              const newMap = new Map(prev);
              const draggedConns = [...(newMap.get(draggedItem.id) || []), targetItem.id];
              const targetConns = [...(newMap.get(targetItem.id) || []), draggedItem.id];
              newMap.set(draggedItem.id, draggedConns);
              newMap.set(targetItem.id, targetConns);
              return newMap;
            });
            const elbowConnsCount = (draggedItem.type === 'elbow' ? currentConnections.length : targetConnections.length) + 1;
            setLastInteractionToast({ 
              title: "Pipe Connected", 
              description: `Elbow(${elbowRotation}°) + Pipe(${pipeRotation}°) connected. (${elbowConnsCount}/2 outlets)`
            });
          }
        } else if (!draggedHasSpace) {
          setLastInteractionToast({ 
            title: "Cannot Connect", 
            description: `${draggedItem.type === 'elbow' ? 'Elbow' : 'Pipe'} already has maximum connections.`,
            variant: "destructive"
          });
        }
      }
      
      // Disconnect items that are no longer overlapping
      if (connectionsToRemove.length > 0) {
        setSnappedConnections(prev => {
          const newMap = new Map(prev);
          
          for (const connectedId of connectionsToRemove) {
            const draggedConns = (newMap.get(draggedItem.id) || []).filter(id => id !== connectedId);
            const targetConns = (newMap.get(connectedId) || []).filter(id => id !== draggedItem.id);
            
            if (draggedConns.length > 0) newMap.set(draggedItem.id, draggedConns);
            else newMap.delete(draggedItem.id);
            
            if (targetConns.length > 0) newMap.set(connectedId, targetConns);
            else newMap.delete(connectedId);
          }
          
          return newMap;
        });
        
        setLastInteractionToast({ 
          title: "Pipe Disconnected", 
          description: `${connectionsToRemove.length} connection(s) unsnapped.`
        });
      }
    }

		// ✅ Pipe-to-pipe snapping (straight run):
		// Only snap when both pipes are collinear: same rotation or exact opposite
		// i.e. rotation modulo 180 matches (0/180 vertical, 90/270 horizontal).
		if (draggedItem.type === 'pipe') {
			const normRot = (r: number) => ((r % 360) + 360) % 360;
			const draggedRot = normRot(draggedItem.rotation ?? 0);

			const isCollinearStraight = (a: number, b: number) => (a % 180) === (b % 180);
			const isVertical = (r: number) => (r % 180) === 0;

			const PIPE_SNAP_DISTANCE = 80; // tweak if needed

			// Helper: remove an existing snap pair (both directions)
			const disconnectPair = (aId: string, bId: string) => {
				setSnappedConnections(prev => {
					const next = new Map(prev);
					next.delete(aId);
					next.delete(bId);
					return next;
				});
			};

			// Helper: connect a new snap pair (both directions), replacing any existing pair for `aId`
			const connectPairReplacing = (aId: string, bId: string) => {
				setSnappedConnections(prev => {
					const next = new Map(prev);

					// If `aId` was connected to something else, remove both directions first
					const old = next.get(aId);
					if (old && old !== bId) {
						next.delete(old);
						next.delete(aId);
					}

					// If `bId` was connected to something else, remove both directions first
					const oldB = next.get(bId);
					if (oldB && oldB !== aId) {
						next.delete(oldB);
						next.delete(bId);
					}

					next.set(aId, bId);
					next.set(bId, aId);
					return next;
				});
			};

			type SnapCandidate = {
				targetId: string;
				snapX: number;
				snapY: number;
				score: number;
			};

			let best: SnapCandidate | null = null;

			const otherPipes = labItems.filter(i => i.type === 'pipe' && i.id !== draggedItem.id);

			for (const target of otherPipes) {
				const targetRot = normRot(target.rotation ?? 0);

				// Only straight/collinear snapping
				if (!isCollinearStraight(draggedRot, targetRot)) continue;

				// Don't try to snap onto a pipe already connected to someone else (unless it's us)
				const targetConnected = snappedConnections.get(target.id);
				if (targetConnected && targetConnected !== draggedItem.id) continue;

				if (isVertical(draggedRot)) {
					// Two options: dragged top -> target bottom OR dragged bottom -> target top
					const option1 = {
						snapX: target.position.x,                      // align X
						snapY: target.position.y + PIPE_BBOX.height,   // place dragged below target
					};
					const option2 = {
						snapX: target.position.x,                      // align X
						snapY: target.position.y - PIPE_BBOX.height,   // place dragged above target
					};

					// Score using endpoint distance + lateral misalignment
					const score1 = Math.hypot(
						(finalX - option1.snapX),
						(finalY - option1.snapY)
					);
					const score2 = Math.hypot(
						(finalX - option2.snapX),
						(finalY - option2.snapY)
					);

					const chosen = score1 <= score2
						? { ...option1, score: score1 }
						: { ...option2, score: score2 };

					if (chosen.score < PIPE_SNAP_DISTANCE && (!best || chosen.score < best.score)) {
						best = { targetId: target.id, snapX: chosen.snapX, snapY: chosen.snapY, score: chosen.score };
					}
				} else {
					// Horizontal (90/270): left<->right end-to-end
					const option1 = {
						snapX: target.position.x + PIPE_BBOX.width,    // place dragged to the right of target
						snapY: target.position.y,                      // align Y
					};
					const option2 = {
						snapX: target.position.x - PIPE_BBOX.width,    // place dragged to the left of target
						snapY: target.position.y,                      // align Y
					};

					const score1 = Math.hypot(
						(finalX - option1.snapX),
						(finalY - option1.snapY)
					);
					const score2 = Math.hypot(
						(finalX - option2.snapX),
						(finalY - option2.snapY)
					);

					const chosen = score1 <= score2
						? { ...option1, score: score1 }
						: { ...option2, score: score2 };

					if (chosen.score < PIPE_SNAP_DISTANCE && (!best || chosen.score < best.score)) {
						best = { targetId: target.id, snapX: chosen.snapX, snapY: chosen.snapY, score: chosen.score };
					}
				}
			}

			const currentlyConnectedId = snappedConnections.get(draggedItem.id);

			if (best) {
				// Apply snap position
				finalX = best.snapX;
				finalY = best.snapY;

				const wasConnectedToThis = currentlyConnectedId === best.targetId;
				if (!wasConnectedToThis) {
					connectPairReplacing(draggedItem.id, best.targetId);
					setLastInteractionToast({
						title: "Pipes Connected",
						description: `Pipe(${draggedRot}°) snapped to Pipe(${normRot(labItems.find(i => i.id === best!.targetId)?.rotation ?? 0)}°).`,
					});
				}
			} else {
				// If we were connected to a pipe, disconnect when moved away
				if (currentlyConnectedId) {
					const connectedItem = labItems.find(i => i.id === currentlyConnectedId);
					if (connectedItem?.type === 'pipe') {
						disconnectPair(draggedItem.id, currentlyConnectedId);
						setLastInteractionToast({
							title: "Pipes Disconnected",
							description: "Pipes unsnapped.",
						});
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
      
      // Disconnect items that are no longer overlapping
      if (connectionsToRemove.length > 0) {
        setSnappedConnections(prev => {
          const newMap = new Map(prev);
          
          for (const connectedId of connectionsToRemove) {
            const draggedConns = (newMap.get(draggedItem.id) || []).filter(id => id !== connectedId);
            const targetConns = (newMap.get(connectedId) || []).filter(id => id !== draggedItem.id);
            
            if (draggedConns.length > 0) newMap.set(draggedItem.id, draggedConns);
            else newMap.delete(draggedItem.id);
            
            if (targetConns.length > 0) newMap.set(connectedId, targetConns);
            else newMap.delete(connectedId);
          }
          
          return newMap;
        });
        
        setLastInteractionToast({ 
          title: "Pipe Disconnected", 
          description: `${connectionsToRemove.length} connection(s) unsnapped.`
        });
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
