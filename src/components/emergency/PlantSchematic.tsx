'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Droplet, Wind, Shield, Zap } from 'lucide-react';

interface PlantSchematicProps {
  gasIntensity: number;
  sprayActive: boolean;
  leakRadius: number;
  valvesOpen: Set<string>;
  pumpsRunning: Set<string>;
  onComponentClick: (componentId: string, type: string) => void;
}

export default function PlantSchematic({
  gasIntensity,
  sprayActive,
  leakRadius,
  valvesOpen,
  pumpsRunning,
  onComponentClick,
}: PlantSchematicProps) {
  const canvasWidth = 1000;
  const canvasHeight = 600;

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-lg border border-blue-500/20 overflow-hidden shadow-2xl">
      {/* Grid background for scale reference */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Main Canvas SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}>
        {/* AMMONIA STORAGE TANK (Primary) */}
        <motion.g
          key="tank"
          onClick={() => onComponentClick('tank-1', 'tank')}
          className="cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          {/* Tank body */}
          <ellipse cx="150" cy="150" rx="60" ry="70" fill="#1e40af" stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
          <rect x="90" y="100" width="120" height="100" fill="#1e40af" stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
          <ellipse cx="150" cy="100" rx="60" ry="20" fill="#2563eb" stroke="#3b82f6" strokeWidth="2" />

          {/* Tank label */}
          <text x="150" y="155" textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="bold">
            NH₃ STORAGE
          </text>
          <text x="150" y="170" textAnchor="middle" fill="#bfdbfe" fontSize="10">
            TANK 1
          </text>

          {/* Warning indicator if gas present */}
          {gasIntensity > 0 && (
            <motion.circle
              cx="210" cy="140" r="8" fill="#ef4444" opacity={0.8 + gasIntensity / 200}
              animate={{ r: [8, 12, 8] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.g>

        {/* COOLING TOWER */}
        <motion.g
          key="tower"
          onClick={() => onComponentClick('tower-1', 'tower')}
          className="cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <rect x="800" y="100" width="80" height="100" fill="none" stroke="#06b6d4" strokeWidth="2" />
          <line x1="810" y1="100" x2="810" y2="200" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
          <line x1="830" y1="100" x2="830" y2="200" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
          <line x1="850" y1="100" x2="850" y2="200" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
          <line x1="870" y1="100" x2="870" y2="200" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
          <text x="840" y="155" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">
            COOLING
          </text>
          <text x="840" y="170" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">
            TOWER
          </text>
        </motion.g>

        {/* CONTROL ROOM */}
        <motion.g
          key="control"
          onClick={() => onComponentClick('control-1', 'control')}
          className="cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <rect x="50" y="400" width="100" height="80" fill="#7c3aed" stroke="#a78bfa" strokeWidth="2" opacity="0.7" />
          <circle cx="65" cy="415" r="3" fill="#fbbf24" />
          <circle cx="80" cy="415" r="3" fill="#34d399" />
          <circle cx="95" cy="415" r="3" fill="#60a5fa" />
          <circle cx="65" cy="435" r="3" fill="#f87171" />
          <circle cx="80" cy="435" r="3" fill="#34d399" />
          <circle cx="95" cy="435" r="3" fill="#60a5fa" />
          <text x="100" y="460" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontWeight="bold">
            CONTROL
          </text>
          <text x="100" y="475" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontWeight="bold">
            ROOM
          </text>
        </motion.g>

        {/* PIPELINE NETWORK */}
        <g opacity="0.7">
          {/* Main tank to valve */}
          <line x1="150" y1="220" x2="150" y2="280" stroke="#3b82f6" strokeWidth="3" />
          {/* Valve 1 */}
          <motion.g key="valve-1" onClick={() => onComponentClick('valve-1', 'valve')} className="cursor-pointer" whileHover={{ scale: 1.08 }}>
            <rect x="140" y="280" width="20" height="20" fill={valvesOpen.has('valve-1') ? '#10b981' : '#ef4444'} stroke="#fff" strokeWidth="1" rx="3" />
            <text x="150" y="292" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
              {valvesOpen.has('valve-1') ? 'V1' : 'V1'}
            </text>
          </motion.g>
          {/* Pipeline continues */}
          <line x1="150" y1="300" x2="150" y2="360" stroke="#3b82f6" strokeWidth="3" />

          {/* LEAK RUPTURE POINT (with animated gas cloud) */}
          <circle cx="150" cy="360" r="6" fill="#fca5a5" stroke="#dc2626" strokeWidth="2" />
          
          {/* Animated gas plume */}
          {gasIntensity > 0 && (
            <>
              <motion.circle
                cx="150" cy="360" r={20 + leakRadius * 0.3}
                fill="url(#gasGradient1)" opacity={Math.min(gasIntensity / 150, 0.6)}
                animate={{ 
                  r: [20 + leakRadius * 0.3, 25 + leakRadius * 0.4],
                  opacity: [Math.min(gasIntensity / 150, 0.6), Math.min(gasIntensity / 200, 0.4)]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.circle
                cx="150" cy="360" r={30 + leakRadius * 0.5}
                fill="url(#gasGradient2)" opacity={Math.min(gasIntensity / 200, 0.3)}
                animate={{ 
                  r: [30 + leakRadius * 0.5, 40 + leakRadius * 0.7],
                  opacity: [Math.min(gasIntensity / 200, 0.3), Math.min(gasIntensity / 250, 0.15)]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </>
          )}

          {/* Water pipe to spray system */}
          <line x1="300" y1="150" x2="500" y2="150" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5,5" />
          
          {/* SPRAY SYSTEM NOZZLES */}
          {sprayActive && (
            <>
              <motion.g animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 0.8, repeat: Infinity }}>
                {[480, 520].map((x, i) => (
                  <g key={i}>
                    {/* Spray cone */}
                    <polygon
                      points={`${x},150 ${x - 30},200 ${x + 30},200`}
                      fill="#06b6d4" opacity="0.3" />
                    {/* Spray particles */}
                    {[...Array(8)].map((_, j) => (
                      <motion.circle
                        key={j}
                        cx={x - 30 + (j * 15)}
                        cy="150"
                        r="2"
                        fill="#06b6d4" opacity="0.7"
                        animate={{
                          cy: [150, 200],
                          opacity: [0.7, 0],
                          x: x - 30 + (j * 15) + (Math.random() - 0.5) * 20,
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: j * 0.1,
                        }}
                      />
                    ))}
                  </g>
                ))}
              </motion.g>
            </>
          )}

          {/* SPRAY SYSTEM BUTTON LOCATION */}
          <motion.g
            key="spray"
            onClick={() => onComponentClick('spray-1', 'spray')}
            className="cursor-pointer"
            whileHover={{ scale: 1.08 }}
          >
            <circle cx="500" cy="150" r="15" fill={sprayActive ? '#10b981' : '#64748b'} stroke="#fff" strokeWidth="2" />
            <Droplet x="491" y="141" width="18" height="18" fill="white" />
          </motion.g>
        </g>

        {/* SAFETY STATIONS */}
        {/* Eyewash Station */}
        <motion.g
          key="eyewash"
          onClick={() => onComponentClick('safety-eyewash', 'safety')}
          className="cursor-pointer"
          whileHover={{ scale: 1.08 }}
        >
          <circle cx="700" cy="500" r="25" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" opacity="0.7" />
          <text x="700" y="485" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">
            EYEWASH
          </text>
          <text x="700" y="500" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">
            STATION
          </text>
        </motion.g>

        {/* Emergency Shower */}
        <motion.g
          key="shower"
          onClick={() => onComponentClick('safety-shower', 'safety')}
          className="cursor-pointer"
          whileHover={{ scale: 1.08 }}
        >
          <rect x="800" y="480" width="50" height="50" fill="#f87171" stroke="#dc2626" strokeWidth="2" opacity="0.7" rx="4" />
          <text x="825" y="495" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
            EMERGENCY
          </text>
          <text x="825" y="507" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
            SHOWER
          </text>
        </motion.g>

        {/* PPE LOCKER */}
        <motion.g
          key="ppe-locker"
          onClick={() => onComponentClick('ppe-locker', 'safety')}
          className="cursor-pointer"
          whileHover={{ scale: 1.08 }}
        >
          <rect x="880" y="480" width="50" height="50" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="2" opacity="0.7" rx="4" />
          <text x="905" y="495" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
            PPE
          </text>
          <text x="905" y="507" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
            LOCKER
          </text>
        </motion.g>

        {/* EMERGENCY EXIT */}
        <motion.g
          key="exit"
          onClick={() => onComponentClick('exit-1', 'exit')}
          className="cursor-pointer"
          whileHover={{ scale: 1.08 }}
        >
          <rect x="50" y="480" width="60" height="40" fill="#10b981" stroke="#059669" strokeWidth="2" opacity="0.8" rx="4" />
          <text x="80" y="505" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">
            EMERGENCY
          </text>
          <text x="80" y="520" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">
            EXIT
          </text>
        </motion.g>

        {/* DEFS FOR GRADIENTS */}
        <defs>
          <radialGradient id="gasGradient1">
            <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gasGradient2">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fecaca" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Legend Overlay - Bottom Left */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-blue-500/30">
        <div className="text-xs text-blue-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Active/Open</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Closed/Inactive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-3 h-3 bg-red-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            ></motion.div>
            <span>Gas Leak</span>
          </div>
        </div>
      </div>

      {/* Leak Alert Badge */}
      {gasIntensity > 0 && (
        <motion.div
          className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-400 flex items-center gap-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <AlertCircle className="w-5 h-5 text-red-200 animate-pulse" />
          <span className="text-red-100 font-semibold text-sm">GAS LEAK DETECTED!</span>
        </motion.div>
      )}
    </div>
  );
}
