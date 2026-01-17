'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Power, Droplet, AlertTriangle, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PPEType } from './PPESelectionPanel';

interface ControlPanelProps {
  valvesOpen: Set<string>;
  pumpsRunning: Set<string>;
  spraySystemActive: boolean;
  currentPPE: PPEType;
  onToggleValve: (valveId: string) => void;
  onTogglePump: (pumpId: string) => void;
  onToggleSpray: () => void;
  onPPEClick: () => void;
  onEvacuate: () => void;
  disabled?: boolean;
}

export default function ControlPanel({
  valvesOpen,
  pumpsRunning,
  spraySystemActive,
  currentPPE,
  onToggleValve,
  onTogglePump,
  onToggleSpray,
  onPPEClick,
  onEvacuate,
  disabled,
}: ControlPanelProps) {
  return (
    <div className=" flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-l border-blue-500/20 shadow-xl">
      {/* Control Panel Card */}
      <motion.div
        className="bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-500/30 rounded-xl shadow-2xl p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wider mb-4">System Controls</h3>

        {/* Valve Control Section */}
        <div className="mb-4 pb-4 border-b border-blue-500/20">
          <p className="text-xs font-semibold text-gray-400 mb-2">🚰 Valves</p>
          <div className="space-y-2">
            {['valve-1', 'valve-2'].map((valveId) => (
              <motion.button
                key={valveId}
                onClick={() => !disabled && onToggleValve(valveId)}
                disabled={disabled}
                className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-between ${
                  valvesOpen.has(valveId)
                    ? 'bg-green-600/80 hover:bg-green-500 text-white'
                    : 'bg-red-600/80 hover:bg-red-500 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{valveId.toUpperCase()}</span>
                <span className="text-xs font-bold">{valvesOpen.has(valveId) ? 'OPEN' : 'CLOSED'}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Pump Control Section */}
        <div className="mb-4 pb-4 border-b border-blue-500/20">
          <p className="text-xs font-semibold text-gray-400 mb-2">⚡ Pumps</p>
          <div className="space-y-2">
            {['pump-1'].map((pumpId) => (
              <motion.button
                key={pumpId}
                onClick={() => !disabled && onTogglePump(pumpId)}
                disabled={disabled}
                className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-between ${
                  pumpsRunning.has(pumpId)
                    ? 'bg-blue-600/80 hover:bg-blue-500 text-white'
                    : 'bg-slate-700/80 hover:bg-slate-600 text-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Power className="w-4 h-4" />
                <span>{pumpId.toUpperCase()}</span>
                <span className="text-xs font-bold">{pumpsRunning.has(pumpId) ? 'ON' : 'OFF'}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Spray System - Prominent */}
        <div className="mb-4 pb-4 border-b border-blue-500/20">
          <p className="text-xs font-semibold text-gray-400 mb-2">💧 Spray System</p>
          <motion.button
            onClick={() => !disabled && onToggleSpray()}
            disabled={disabled}
            className={`w-full px-4 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
              spraySystemActive
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/50'
                : 'bg-gray-700/80 hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={spraySystemActive ? { boxShadow: ['0 0 10px rgba(34, 211, 238, 0.3)', '0 0 20px rgba(34, 211, 238, 0.6)', '0 0 10px rgba(34, 211, 238, 0.3)'] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Droplet className="w-5 h-5" />
            <span>{spraySystemActive ? 'SPRAY: ON' : 'SPRAY: OFF'}</span>
          </motion.button>
        </div>

        {/* PPE Selection */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-2">🛡️ PPE Status</p>
          <motion.button
            onClick={() => !disabled && onPPEClick()}
            disabled={disabled}
            className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-between ${
              currentPPE === 'none'
                ? 'bg-red-600/40 border border-red-500/60 text-red-200 hover:bg-red-600/60'
                : 'bg-green-600/40 border border-green-500/60 text-green-200 hover:bg-green-600/60'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Shield className="w-4 h-4" />
            <span>{currentPPE === 'none' ? 'No PPE' : currentPPE.toUpperCase()}</span>
          </motion.button>
        </div>

        {/* Evacuation Button */}
        <motion.button
          onClick={() => !disabled && onEvacuate()}
          disabled={disabled}
          className="w-full px-4 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            boxShadow: ['0 0 0px rgba(239, 68, 68, 0)', '0 0 20px rgba(239, 68, 68, 0.6)', '0 0 0px rgba(239, 68, 68, 0)'],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <LogOut className="w-5 h-5" />
          <span>EMERGENCY EVACUATION</span>
        </motion.button>
      </motion.div>

      {/* Quick Reference Card */}
      <motion.div
        className="bg-blue-950/40 border border-blue-500/30 rounded-lg p-3 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs text-blue-200 font-semibold mb-2">📋 Quick Guide:</p>
        <ul className="text-xs text-blue-300 space-y-1">
          <li>• Open valves to isolate leak source</li>
          <li>• Activate spray to contain gas</li>
          <li>• Equip PPE before approaching</li>
          <li>• Follow SOP checklist</li>
        </ul>
      </motion.div>
    </div>
  );
}
