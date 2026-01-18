'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/lab/Header';
import PlantSchematic from '@/components/emergency/PlantSchematic';
import RightSidebar from '@/components/emergency/RightSidebar';
import ControlPanel from '@/components/emergency/ControlPanel';
import PPESelectionPanel, { type PPEType } from '@/components/emergency/PPESelectionPanel';
import { useToast } from '@/hooks/use-toast';
import type { ProcedureStep, ActionLog } from '@/types/emergency';

export default function EmergencyResponseSimulation() {
  // Simulation State
  const [isRunning, setIsRunning] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gasConcentration, setGasConcentration] = useState(0);
  const [leakRadius, setLeakRadius] = useState(0);
  const [spraySystemActive, setSpraySystemActive] = useState(false);
  const [valvesOpen, setValvesOpen] = useState<Set<string>>(new Set(['valve-1']));
  const [pumpsRunning, setPumpsRunning] = useState<Set<string>>(new Set());
  const [currentPPE, setCurrentPPE] = useState<PPEType>('none');
  const [ppeModalOpen, setPpeModalOpen] = useState(false);
  const [evacuationTriggered, setEvacuationTriggered] = useState(false);
  const [actionLog, setActionLog] = useState<ActionLog[]>([]);
  const [procedureSteps, setProcedureSteps] = useState<ProcedureStep[]>([
    {
      id: 'step-1',
      instruction: 'Identify and confirm ammonia gas leak',
      completed: false,
      critical: true,
      requiredPPE: 'mask',
    },
    {
      id: 'step-2',
      instruction: 'Close main storage valve (Valve 1)',
      completed: false,
      critical: true,
      requiredPPE: 'gloves',
    },
    {
      id: 'step-3',
      instruction: 'Activate water spray suppression system',
      completed: false,
      critical: true,
      requiredPPE: 'none',
    },
    {
      id: 'step-4',
      instruction: 'Evacuate non-essential personnel',
      completed: false,
      critical: true,
      requiredPPE: 'none',
    },
    {
      id: 'step-5',
      instruction: 'Position rescue team with full protective gear',
      completed: false,
      critical: false,
      requiredPPE: 'full',
    },
    {
      id: 'step-6',
      instruction: 'Initiate emergency protocols and notify authorities',
      completed: false,
      critical: false,
      requiredPPE: 'mask',
    },
  ]);

  const { toast } = useToast();

  // Add action to log
  const addActionLog = useCallback(
    (action: string, status: 'success' | 'warning' | 'error' | 'info' = 'info', component?: string) => {
      const newLog: ActionLog = {
        id: `log-${Date.now()}`,
        timestamp: elapsedTime * 1000,
        action,
        component,
        status,
      };
      setActionLog((prev) => [...prev, newLog].slice(-20)); // Keep last 20 logs
    },
    [elapsedTime]
  );

  // Main simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);

      // Gas leak grows over time if not contained
      setGasConcentration((prev) => {
        let newConcentration = prev;
        // Base growth rate
        newConcentration += 0.5;
        // Spray reduces gas
        if (spraySystemActive) {
          newConcentration *= 0.85; // Spray reduces by 15% per second
        }
        // Valve closure helps but doesn't stop immediate leak
        if (valvesOpen.has('valve-1')) {
          newConcentration += 0.2; // Main valve open increases leak
        }
        return Math.max(0, newConcentration);
      });

      // Leak radius expands
      setLeakRadius((prev) => {
        if (spraySystemActive) {
          return Math.max(0, prev - 1); // Spray contains spread
        }
        return prev + 0.5;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, spraySystemActive, valvesOpen]);

  // Auto-mark procedure steps
  useEffect(() => {
    setProcedureSteps((prev) =>
      prev.map((step) => {
        // Step 1: detect leak (gas > 5 ppm and mask equipped)
        if (step.id === 'step-1' && gasConcentration > 5 && currentPPE === 'mask' && !step.completed) {
          addActionLog('✓ Gas leak identified with proper PPE', 'success');
          return { ...step, completed: true };
        }
        // Step 2: Close valve
        if (step.id === 'step-2' && !valvesOpen.has('valve-1') && !step.completed) {
          addActionLog('✓ Main storage valve closed', 'success');
          return { ...step, completed: true };
        }
        // Step 3: Activate spray
        if (step.id === 'step-3' && spraySystemActive && !step.completed) {
          addActionLog('✓ Water spray system activated', 'success');
          return { ...step, completed: true };
        }
        // Step 4: Evacuation triggered
        if (step.id === 'step-4' && evacuationTriggered && !step.completed) {
          addActionLog('✓ Evacuation initiated', 'success');
          return { ...step, completed: true };
        }
        // Step 5: Full PPE equipped
        if (step.id === 'step-5' && currentPPE === 'full' && !step.completed) {
          addActionLog('✓ Full protective gear equipped', 'success');
          return { ...step, completed: true };
        }
        return step;
      })
    );
  }, [gasConcentration, valvesOpen, spraySystemActive, currentPPE, evacuationTriggered, addActionLog]);

  // Handle component interactions
  const handleComponentClick = (componentId: string, type: string) => {
    if (evacuationTriggered) {
      toast({ title: 'Evacuation Active', description: 'Cannot interact during evacuation.' });
      return;
    }

    // PPE checks for dangerous operations
    if (type === 'tank' && currentPPE === 'none') {
      toast({
        title: 'PPE Required',
        description: 'You must equip protective equipment before approaching the tank.',
        variant: 'destructive',
      });
      return;
    }

    addActionLog(`Interacted with ${componentId}`, 'info', componentId);
  };

  const handleToggleValve = (valveId: string) => {
    setValvesOpen((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(valveId)) {
        newSet.delete(valveId);
        addActionLog(`${valveId.toUpperCase()} OPENED - ⚠ Leak flow increased!`, 'warning', valveId);
      } else {
        newSet.add(valveId);
        addActionLog(`${valveId.toUpperCase()} CLOSED - Leak source isolated`, 'success', valveId);
      }
      return newSet;
    });
  };

  const handleTogglePump = (pumpId: string) => {
    setPumpsRunning((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pumpId)) {
        newSet.delete(pumpId);
        addActionLog(`${pumpId.toUpperCase()} STOPPED`, 'info', pumpId);
      } else {
        newSet.add(pumpId);
        addActionLog(`${pumpId.toUpperCase()} STARTED - Circulation enabled`, 'success', pumpId);
      }
      return newSet;
    });
  };

  const handleToggleSpray = () => {
    setSpraySystemActive((prev) => {
      const newState = !prev;
      if (newState) {
        addActionLog('💧 WATER SPRAY ACTIVATED - Gas containment in progress', 'success');
      } else {
        addActionLog('💧 Water spray deactivated', 'warning');
      }
      return newState;
    });
  };

  const handleEvacuation = () => {
    setEvacuationTriggered(true);
    setIsRunning(false);
    addActionLog('🚨 EMERGENCY EVACUATION PROTOCOL INITIATED', 'error');
    toast({
      title: 'Evacuation Started',
      description: 'All personnel must leave the facility immediately.',
      variant: 'destructive',
    });
  };

  const handleReset = () => {
    setElapsedTime(0);
    setGasConcentration(0);
    setLeakRadius(0);
    setSpraySystemActive(false);
    setValvesOpen(new Set());
    setPumpsRunning(new Set());
    setCurrentPPE('none');
    setEvacuationTriggered(false);
    setActionLog([]);
    setIsRunning(true);
    setProcedureSteps((prev) => prev.map((s) => ({ ...s, completed: false })));
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
      <Header
        onSave={() => {
          const state = {
            elapsedTime,
            gasConcentration,
            valvesOpen: Array.from(valvesOpen),
            pumpsRunning: Array.from(pumpsRunning),
            spraySystemActive,
            currentPPE,
          };
          console.log('Simulation State:', state);
          toast({ title: 'State Saved', description: 'Simulation state saved to console.' });
        }}
        onReset={handleReset}
      />

      <main className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
        {/* Left Sidebar - Control Panel */}
        <div className="col-span-12 md:col-span-2 flex flex-col min-h-0">
          <ControlPanel
            valvesOpen={valvesOpen}
            pumpsRunning={pumpsRunning}
            spraySystemActive={spraySystemActive}
            currentPPE={currentPPE}
            onToggleValve={handleToggleValve}
            onTogglePump={handleTogglePump}
            onToggleSpray={handleToggleSpray}
            onPPEClick={() => setPpeModalOpen(true)}
            onEvacuate={handleEvacuation}
            disabled={evacuationTriggered}
          />
        </div>
        
        {/* Center - Main Canvas */}
        <div className="col-span-12 md:col-span-7 flex flex-col min-h-0">
          <div className="flex-1 relative">
            <PlantSchematic
              gasIntensity={gasConcentration}
              sprayActive={spraySystemActive}
              leakRadius={leakRadius}
              valvesOpen={valvesOpen}
              pumpsRunning={pumpsRunning}
              onComponentClick={handleComponentClick}
            />
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="col-span-12 md:col-span-3 flex flex-col min-h-0">
          <RightSidebar
            gasConcentration={gasConcentration}
            elapsedTime={elapsedTime}
            procedureSteps={procedureSteps}
            actionLog={actionLog}
            simulationState={isRunning ? 'running' : 'paused'}
            alarmStatus={{
              gasLeak: gasConcentration > 50,
              spraySystemOff: !spraySystemActive && gasConcentration > 10,
              evacuationTriggered,
            }}
          />
        </div>
        
      </main>

      {/* PPE Selection Modal */}
      <PPESelectionPanel
        currentPPE={currentPPE}
        onPPESelect={setCurrentPPE}
        isOpen={ppeModalOpen}
        onClose={() => setPpeModalOpen(false)}
        requiredPPE={procedureSteps.find((s) => !s.completed)?.requiredPPE}
      />

      {/* Emergency Banner - Full Screen When Evacuation Active */}
      {evacuationTriggered && (
        <motion.div
          className="fixed inset-0 bg-red-600/90 backdrop-blur-md z-50 flex items-center justify-center pointer-events-none"
          animate={{
            opacity: [1, 0.8, 1],
            backgroundColor: ['rgba(220, 38, 38, 0.9)', 'rgba(239, 68, 68, 0.9)', 'rgba(220, 38, 38, 0.9)'],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="text-center">
            <motion.div
              className="text-8xl font-black text-white mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              🚨
            </motion.div>
            <h1 className="text-5xl font-black text-white mb-2">EVACUATION IN PROGRESS</h1>
            <p className="text-2xl text-red-100">Proceed immediately to the nearest emergency exit</p>
            <div className="mt-8 text-lg text-red-100 font-semibold">
              Time Elapsed: {Math.floor(elapsedTime / 60)}m {(elapsedTime % 60).toString().padStart(2, '0')}s
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
