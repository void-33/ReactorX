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
    <div className="relative w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-blue-500/30 overflow-hidden shadow-2xl">
      {/* Enhanced Grid background for scale reference */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.25" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#smallGrid)" opacity="0.5" />
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
          {/* Tank shadow/glow */}
          <filter id="tankGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Tank body - enhanced 3D look */}
          {/* <ellipse cx="150" cy="150" rx="60" ry="70" fill="#0f3460" stroke="#00d9ff" strokeWidth="2.5" opacity="0.9" filter="url(#tankGlow)" /> */}
          <rect x="90" y="100" width="120" height="100" fill="#1a4d6d" stroke="#00d9ff" strokeWidth="2.5" opacity="0.9" />
          <ellipse cx="150" cy="100" rx="60" ry="20" fill="#2a6e8f" stroke="#00d9ff" strokeWidth="2.5" opacity="0.95" />
          
          {/* Tank top cap detail */}
          <circle cx="150" cy="100" r="8" fill="#00d9ff" opacity="0.5" />
          <line x1="150" y1="92" x2="150" y2="85" stroke="#00d9ff" strokeWidth="2" opacity="0.8" />

          {/* Pressure gauge indicator */}
          <circle cx="190" cy="140" r="6" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.7" />
          <line x1="190" y1="137" x2="190" y2="130" stroke="#60a5fa" strokeWidth="1.5" opacity="0.8" />

          {/* Tank label with better styling */}
          <rect x="110" y="145" width="80" height="30" fill="rgba(15, 52, 96, 0.8)" stroke="#60a5fa" strokeWidth="1" rx="3" opacity="0.9" />
          <text x="150" y="157" textAnchor="middle" fill="#00d9ff" fontSize="13" fontWeight="bold">
            NH₃ STORAGE
          </text>
          <text x="150" y="171" textAnchor="middle" fill="#7dd3fc" fontSize="11">
            TANK 1
          </text>

          {/* Warning indicator if gas present */}
          {gasIntensity > 5 && (
            <motion.circle
              cx="210" cy="140" r="8" fill="#ff3d3d" opacity={0.8 + gasIntensity / 200}
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
          {/* Tower outer structure */}
          <path d="M 790 120 L 800 100 L 880 100 L 890 120 L 890 200 L 790 200 Z" fill="none" stroke="#10b981" strokeWidth="2.5" opacity="0.8" />
          
          {/* Tower internal structure - pipes */}
          <line x1="810" y1="100" x2="808" y2="200" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
          <line x1="835" y1="100" x2="835" y2="200" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
          <line x1="860" y1="100" x2="862" y2="200" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
          
          {/* Tower fill level indicator */}
          <motion.rect
            x="795" y="130" width="80" height="65" fill="#10b981" opacity="0.3"
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Tower label */}
          <rect x="805" y="155" width="60" height="30" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="1" rx="3" />
          <text x="835" y="167" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold">
            COOLING
          </text>
          <text x="835" y="180" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold">
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
          {/* Control room building */}
          <rect x="50" y="400" width="100" height="80" fill="#6d28d9" stroke="#a78bfa" strokeWidth="2.5" opacity="0.8" rx="4" />
          
          {/* Door */}
          <rect x="55" y="440" width="20" height="35" fill="#4c1d95" stroke="#a78bfa" strokeWidth="1" rx="2" />
          <circle cx="72" cy="457" r="1.5" fill="#a78bfa" />

          {/* Control panel lights */}
          <g opacity="0.9">
            <circle cx="85" cy="415" r="3.5" fill={gasIntensity > 0 ? '#ff3d3d' : '#34d399'} filter="url(#componentGlow)" />
            <circle cx="100" cy="415" r="3.5" fill="#fbbf24" filter="url(#componentGlow)" />
            <circle cx="115" cy="415" r="3.5" fill="#60a5fa" filter="url(#componentGlow)" />
            
            <circle cx="85" cy="435" r="3.5" fill="#34d399" filter="url(#componentGlow)" />
            <circle cx="100" cy="435" r="3.5" fill="#f87171" filter="url(#componentGlow)" />
            <circle cx="115" cy="435" r="3.5" fill="#60a5fa" filter="url(#componentGlow)" />
          </g>

          {/* Window */}
          <rect x="65" y="405" width="30" height="25" fill="none" stroke="#a78bfa" strokeWidth="1" />
          <line x1="80" y1="405" x2="80" y2="430" stroke="#a78bfa" strokeWidth="0.5" opacity="0.5" />
          <line x1="65" y1="417" x2="95" y2="417" stroke="#a78bfa" strokeWidth="0.5" opacity="0.5" />

          {/* Label */}
          <rect x="55" y="465" width="90" height="18" fill="rgba(109, 40, 217, 0.6)" stroke="#a78bfa" strokeWidth="1" rx="2" />
          <text x="100" y="477" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="bold">
            CONTROL ROOM
          </text>
        </motion.g>

        {/* PIPELINE NETWORK */}
        <g opacity="0.85">
          {/* Main tank to valve - enhanced pipe */}
          <line x1="150" y1="220" x2="150" y2="280" stroke="#00d9ff" strokeWidth="4" opacity="0.7" />
          <line x1="150" y1="220" x2="150" y2="280" stroke="#60a5fa" strokeWidth="2" opacity="0.5" strokeDasharray="2,2" />
          
          {/* Valve 1 - Enhanced Design */}
          <motion.g key="valve-1" onClick={() => onComponentClick('valve-1', 'valve')} className="cursor-pointer" whileHover={{ scale: 1.1 }}>
            {/* Valve body */}
            <rect x="135" y="275" width="30" height="30" fill={valvesOpen.has('valve-1') ? '#10b981' : '#ef4444'} stroke="#fff" strokeWidth="2" rx="4" opacity="0.8" filter="url(#componentGlow)" />
            {/* Valve indicator line */}
            <motion.line 
              x1="150" y1="280" 
              x2="150" y2="305" 
              stroke="#fff" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              animate={{ rotate: valvesOpen.has('valve-1') ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            />
            {/* Valve label */}
            <text x="150" y="295" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
              V1
            </text>
          </motion.g>

          {/* Pipeline continues */}
          <line x1="150" y1="305" x2="150" y2="360" stroke="#00d9ff" strokeWidth="4" opacity="0.7" />
          <line x1="150" y1="305" x2="150" y2="360" stroke="#60a5fa" strokeWidth="2" opacity="0.5" strokeDasharray="2,2" />

          {/* LEAK RUPTURE POINT (with enhanced visuals) */}
          <circle cx="150" cy="360" r="8" fill="#fca5a5" stroke="#dc2626" strokeWidth="2.5" filter="url(#componentGlow)" />
          <circle cx="150" cy="360" r="6" fill="#ef4444" opacity="0.6" />
          
          {/* Crack lines */}
          <line x1="150" y1="352" x2="145" y2="345" stroke="#fca5a5" strokeWidth="1.5" opacity="0.7" />
          <line x1="150" y1="352" x2="155" y2="345" stroke="#fca5a5" strokeWidth="1.5" opacity="0.7" />

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

          {/* Water pipe to spray system - enhanced */}
          <line x1="300" y1="150" x2="500" y2="150" stroke="#10b981" strokeWidth="3" strokeDasharray="5,5" opacity="0.7" />
          <line x1="300" y1="150" x2="500" y2="150" stroke="#34d399" strokeWidth="1.5" opacity="0.5" />
          
          {/* SPRAY SYSTEM NOZZLES */}
          {sprayActive && (
            <>
              <motion.g animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 0.8, repeat: Infinity }}>
                {[480, 520].map((x, i) => (
                  <g key={i}>
                    {/* Spray cone */}
                    <polygon
                      points={`${x},150 ${x - 30},200 ${x + 30},200`}
                      fill="#10b981" stroke="#10b981" strokeWidth="1" opacity="0.35" />
                    {/* Spray particles */}
                    {[...Array(8)].map((_, j) => (
                      <motion.circle
                        key={j}
                        cx={x - 30 + (j * 15)}
                        cy="150"
                        r="2.5"
                        fill="#10b981" opacity="0.8"
                        animate={{
                          cy: [150, 200],
                          opacity: [0.8, 0],
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
            whileHover={{ scale: 1.1 }}
          >
            {/* Spray valve body */}
            <circle cx="500" cy="150" r="18" fill={sprayActive ? '#10b981' : '#64748b'} stroke="#fff" strokeWidth="2.5" filter="url(#componentGlow)" opacity="0.85" />
            {/* Spray icon */}
            <path
              d="M 495 145 Q 500 140 505 145 M 495 150 L 505 150 M 495 155 Q 500 160 505 155"
              stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Status dot */}
            <circle cx="512" cy="138" r="4" fill={sprayActive ? '#10b981' : '#ef4444'} stroke="#fff" strokeWidth="1" opacity="0.9" />
          </motion.g>
        </g>

        {/* SAFETY STATIONS */}
        {/* Eyewash Station */}
        <motion.g
          key="eyewash"
          onClick={() => onComponentClick('safety-eyewash', 'safety')}
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }}
        >
          {/* Station frame */}
          <rect x="675" y="475" width="50" height="60" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2.5" opacity="0.7" rx="3" />
          
          {/* Eyewash nozzles */}
          <circle cx="685" cy="490" r="4" fill="#fff" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="715" cy="490" r="4" fill="#fff" stroke="#f59e0b" strokeWidth="1.5" />
          
          {/* Control lever */}
          <path d="M 700 505 L 700 525" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          
          {/* Label */}
          <rect x="677" y="532" width="46" height="24" fill="rgba(251, 191, 36, 0.3)" stroke="#f59e0b" strokeWidth="1" rx="2" />
          <text x="700" y="543" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
            EYEWASH
          </text>
          <text x="700" y="553" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
            STATION
          </text>
        </motion.g>

        {/* Emergency Shower */}
        <motion.g
          key="shower"
          onClick={() => onComponentClick('safety-shower', 'safety')}
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }}
        >
          {/* Shower head frame */}
          <rect x="780" y="470" width="70" height="70" fill="#f87171" stroke="#dc2626" strokeWidth="2.5" opacity="0.8" rx="4" />
          
          {/* Shower head arm */}
          <path d="M 815 480 L 815 460" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
          <circle cx="815" cy="460" r="8" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
          
          {/* Shower head nozzles */}
          {[...Array(5)].map((_, i) => (
            <circle key={i} cx={810 + i * 2} cy="458" r="1.5" fill="#fff" />
          ))}
          
          {/* Control lever */}
          <path d="M 800 510 L 780 510 L 775 515" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Label */}
          <rect x="787" y="532" width="56" height="24" fill="rgba(248, 113, 113, 0.3)" stroke="#dc2626" strokeWidth="1" rx="2" />
          <text x="815" y="543" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">
            EMERGENCY
          </text>
          <text x="815" y="553" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">
            SHOWER
          </text>
        </motion.g>

        {/* PPE LOCKER */}
        <motion.g
          key="ppe-locker"
          onClick={() => onComponentClick('ppe-locker', 'safety')}
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }}
        >
          {/* Locker cabinet */}
          <rect x="870" y="475" width="60" height="65" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="2.5" opacity="0.8" rx="3" />
          
          {/* Locker compartments */}
          <line x1="870" y1="495" x2="930" y2="495" stroke="#a78bfa" strokeWidth="1.5" opacity="0.6" />
          <line x1="900" y1="475" x2="900" y2="540" stroke="#a78bfa" strokeWidth="1.5" opacity="0.6" />
          
          {/* Door handles */}
          <circle cx="885" cy="485" r="2" fill="#a78bfa" />
          <circle cx="915" cy="485" r="2" fill="#a78bfa" />
          <circle cx="885" cy="515" r="2" fill="#a78bfa" />
          <circle cx="915" cy="515" r="2" fill="#a78bfa" />
          
          {/* Label */}
          <rect x="877" y="537" width="46" height="20" fill="rgba(139, 92, 246, 0.3)" stroke="#a78bfa" strokeWidth="1" rx="2" />
          <text x="900" y="549" textAnchor="middle" fill="#e9d5ff" fontSize="10" fontWeight="bold">
            PPE
          </text>
        </motion.g>

        {/* EMERGENCY EXIT */}
        <motion.g
          key="exit"
          onClick={() => onComponentClick('exit-1', 'exit')}
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }}
        >
          {/* Exit door frame */}
          <rect x="45" y="480" width="70" height="50" fill="#059669" stroke="#10b981" strokeWidth="2.5" opacity="0.85" rx="4" />
          
          {/* Door with detail */}
          <rect x="55" y="490" width="50" height="30" fill="#047857" stroke="#10b981" strokeWidth="1.5" rx="2" />
          
          {/* Emergency exit symbol - Arrow */}
          <path d="M 60 505 L 80 495 L 80 515 Z" fill="#fff" opacity="0.9" />
          
          {/* Label */}
          <rect x="50" y="532" width="60" height="20" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="1" rx="2" />
          <text x="80" y="544" textAnchor="middle" fill="#d1fae5" fontSize="10" fontWeight="bold">
            EMERGENCY EXIT
          </text>
        </motion.g>

        {/* DEFS FOR GRADIENTS AND FILTERS */}
        <defs>
          {/* Component Glow Filter */}
          <filter id="componentGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Gas Gradients */}
          <radialGradient id="gasGradient1">
            <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#ff8787" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffa8a8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gasGradient2">
            <stop offset="0%" stopColor="#ff8787" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#ffb3b3" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffd9d9" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Enhanced Legend Overlay - Bottom Left */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md p-4 rounded-xl border border-blue-500/40 shadow-lg">
        <div className="text-xs text-blue-100 space-y-2">
          <div className="font-bold text-blue-300 mb-2">Status Legend</div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
            <span>Active/Open</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
            <span>Closed/Inactive</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
            <span>Warning/Caution</span>
          </div>
          <div className="flex items-center gap-2.5">
            <motion.div
              className="w-3 h-3 bg-red-400 rounded-full shadow-lg shadow-red-500/70"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            ></motion.div>
            <span>Gas Leak Alert</span>
          </div>
        </div>
      </div>

      {/* Enhanced Leak Alert Badge */}
      {gasIntensity > 0 && (
        <motion.div
          className="absolute top-4 right-4 bg-red-600/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-red-400/60 flex items-center gap-3 shadow-xl"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertCircle className="w-5 h-5 text-red-200" />
          </motion.div>
          <div>
            <div className="text-red-100 font-bold text-sm">GAS LEAK DETECTED!</div>
            <div className="text-red-200 text-xs opacity-90">Intensity: {Math.round(gasIntensity)}%</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
