'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const flameVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' }
  }
};

export default function Burner() {
  const [isHeating, setIsHeating] = useState(false);

  return (
    <div
      onClick={() => setIsHeating(!isHeating)}
      className="relative w-24 h-24 flex flex-col items-center justify-end cursor-pointer"
    >
      {/* Flame */}
      <AnimatePresence>
        {isHeating && (
          <motion.svg
            viewBox="0 0 40 50"
            className="absolute w-10 h-12 -top-4 drop-shadow-lg"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={flameVariants}
            style={{ originY: '100%' }}
          >
            <motion.path
              d="M20 50 C 20 50, 0 35, 20 0 C 20 0, 40 35, 20 50 Z"
              fill="url(#flameGradient)"
              animate={{
                scaleY: [1, 1.08, 0.95, 1.03, 1],
                skewX: [0, 2, -2, 1, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <defs>
              <radialGradient id="flameGradient">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.6" />
              </radialGradient>
            </defs>
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Burner Body */}
      <svg viewBox="0 0 100 40" className="w-full h-10">
        <path d="M40 0 H60 V15 H40 Z" fill="hsl(var(--muted-foreground)/0.7)" />
        <path d="M10 15 H90 V25 H10 Z" fill="hsl(var(--muted-foreground)/0.7)" />
        <rect x="20" y="25" width="60" height="15" rx="5" fill="hsl(var(--muted-foreground)/0.9)" />
      </svg>

      <span className="text-xs mt-1 opacity-60">
        {isHeating ? 'Heating ON' : 'Heating OFF'}
      </span>
    </div>
  );
}
