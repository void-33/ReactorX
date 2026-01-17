'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import type { ProcedureStep, ActionLog } from '@/types/emergency';

interface RightSidebarProps {
  gasConcentration: number;
  elapsedTime: number;
  procedureSteps: ProcedureStep[];
  actionLog: ActionLog[];
  simulationState: string;
  alarmStatus: {
    gasLeak: boolean;
    spraySystemOff: boolean;
    evacuationTriggered: boolean;
  };
  onProcedureStepClick?: (stepId: string) => void;
}

export default function RightSidebar({
  gasConcentration,
  elapsedTime,
  procedureSteps,
  actionLog,
  simulationState,
  alarmStatus,
  onProcedureStepClick,
}: RightSidebarProps) {
  const getConcentrationStatus = (ppm: number) => {
    if (ppm >= 500) return { color: 'bg-red-600', label: 'CRITICAL', textColor: 'text-red-300' };
    if (ppm >= 100) return { color: 'bg-orange-600', label: 'HIGH', textColor: 'text-orange-300' };
    if (ppm >= 10) return { color: 'bg-yellow-600', label: 'ELEVATED', textColor: 'text-yellow-300' };
    return { color: 'bg-green-600', label: 'SAFE', textColor: 'text-green-300' };
  };

  const concentrationStatus = getConcentrationStatus(gasConcentration);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const completedSteps = procedureSteps.filter(s => s.completed).length;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-l border-blue-500/20 shadow-xl">
      {/* ALARM INDICATORS */}
      <div className="flex-shrink-0 p-4 border-b border-blue-500/20 space-y-2">
        <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider">⚠ Alarm Status</div>
        
        <div className="space-y-2">
          {/* Gas Leak Alarm */}
          {alarmStatus.gasLeak && (
            <motion.div
              className="flex items-center gap-2 px-3 py-2 bg-red-950/60 border border-red-500/60 rounded-lg"
              animate={{ backgroundColor: ['rgba(127, 29, 29, 0.6)', 'rgba(159, 18, 18, 0.8)', 'rgba(127, 29, 29, 0.6)'] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-xs font-semibold text-red-200">Gas Leak – HIGH RISK</span>
            </motion.div>
          )}

          {/* Spray System Status */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/60 border border-blue-500/30 rounded-lg">
            <div className="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
            <span className="text-xs font-semibold text-gray-300">Spray System: OFF</span>
          </div>

          {/* Evacuation Alert */}
          {alarmStatus.evacuationTriggered && (
            <motion.div
              className="flex items-center gap-2 px-3 py-2 bg-purple-950/60 border border-purple-500/60 rounded-lg"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              <AlertCircle className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-purple-200">EVACUATION IN PROGRESS</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* SIMULATION TIMER */}
      <div className="flex-shrink-0 p-4 border-b border-blue-500/20">
        <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">Elapsed Time</div>
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 rounded-lg flex items-center gap-3"
          animate={{ boxShadow: ['0 0 10px rgba(59, 130, 246, 0.3)', '0 0 20px rgba(59, 130, 246, 0.6)', '0 0 10px rgba(59, 130, 246, 0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Clock className="w-5 h-5 text-blue-100" />
          <span className="text-xl font-bold text-white font-mono">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </motion.div>
      </div>

      {/* GAS CONCENTRATION METER */}
      <div className="flex-shrink-0 p-4 border-b border-blue-500/20">
        <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">Gas Concentration</div>
        
        <div className="space-y-2">
          {/* Numeric Display */}
          <div className="flex items-end justify-between">
            <span className={`text-2xl font-bold ${concentrationStatus.textColor}`}>
              {gasConcentration.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">ppm</span>
          </div>

          {/* Bar Gauge */}
          <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600">
            <motion.div
              className={`h-full ${concentrationStatus.color} transition-all`}
              animate={{ width: `${Math.min((gasConcentration / 500) * 100, 100)}%` }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
          </div>

          {/* Status Label */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${concentrationStatus.color}`}></div>
            <span className={`text-xs font-semibold ${concentrationStatus.textColor}`}>
              {concentrationStatus.label}
            </span>
          </div>

          {/* Threshold indicators */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0</span>
            <span>10</span>
            <span>100</span>
            <span>500+</span>
          </div>
        </div>
      </div>

      {/* PROCEDURE STEPS - SCROLLABLE */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0 border-b border-blue-500/20">
        <div className="px-4 pt-4 pb-2 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider">SOP Instructions</div>
            <span className="text-xs text-gray-400 bg-slate-700/50 px-2 py-0.5 rounded">
              {completedSteps}/{procedureSteps.length}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {procedureSteps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                step.completed
                  ? 'bg-green-950/40 border-green-500/30'
                  : step.critical
                  ? 'bg-red-950/40 border-red-500/50 hover:border-red-500/70'
                  : 'bg-slate-700/40 border-slate-600/50 hover:border-blue-500/50'
              }`}
              onClick={() => onProcedureStepClick?.(step.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : step.critical ? (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  </motion.div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-400 mt-0.5">
                    {index + 1}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${step.completed ? 'text-green-200 line-through' : 'text-white'}`}>
                    {step.instruction}
                  </p>
                  {step.requiredPPE && step.requiredPPE !== 'none' && (
                    <p className="text-xs text-yellow-300 mt-1">
                      📦 Requires: {step.requiredPPE.toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ACTION LOG - SCROLLABLE */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="px-4 pt-4 pb-2 flex-shrink-0 text-xs font-semibold text-blue-300 uppercase tracking-wider">
          Activity Log
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 text-xs">
          {actionLog.slice().reverse().map((log) => (
            <motion.div
              key={log.id}
              className={`py-1.5 px-2 rounded border-l-2 ${
                log.status === 'error'
                  ? 'bg-red-950/30 border-l-red-500 text-red-200'
                  : log.status === 'warning'
                  ? 'bg-yellow-950/30 border-l-yellow-500 text-yellow-200'
                  : log.status === 'success'
                  ? 'bg-green-950/30 border-l-green-500 text-green-200'
                  : 'bg-slate-700/30 border-l-blue-500 text-slate-300'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-start gap-2">
                <span className="flex-1">{log.action}</span>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {Math.floor(log.timestamp / 1000)}s
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
