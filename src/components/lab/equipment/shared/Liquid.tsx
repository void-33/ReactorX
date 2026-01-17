'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface LiquidProps {
  color: string;
  level: number; // 0 to 1
  isHeating?: boolean;
  shape: 'rect' | 'trapezoid';
}

const liquidPath = {
    rect: "M15 90 H85 V10 H15 Z",
    trapezoid: "M20 90 H80 L60 30 L40 30 Z",
};

export default function Liquid({ color, level, isHeating, shape }: LiquidProps) {
  const yPosition = 90 - 80 * level;

  const bubbleVariants = {
    initial: { y: 0, opacity: 0 },
    animate: (i: number) => ({
      y: -70 * level,
      opacity: [0, 0.7, 0.7, 0],
      scale: [0, 1, 1, 1],
      transition: {
        duration: 1.5 + Math.random() * 1.5,
        repeat: Infinity,
        delay: i * 0.3,
        ease: "linear",
      },
    }),
  };

  return (
    <g>
      <mask id={`liquidMask-${shape}`}>
        <path d={liquidPath[shape]} fill="white" />
      </mask>
      <motion.rect
        mask={`url(#liquidMask-${shape})`}
        x="10"
        width="80"
        height="80"
        fill={color}
        initial={{ y: 90 }}
        animate={{ y: yPosition }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      />
      {isHeating && (
        <g mask={`url(#liquidMask-${shape})`}>
          {[...Array(5)].map((_, i) => (
            <motion.circle
              key={i}
              cx={20 + Math.random() * 60}
              cy={88}
              r={2 + Math.random()}
              fill="white"
              variants={bubbleVariants}
              initial="initial"
              animate="animate"
              custom={i}
            />
          ))}
        </g>
      )}
    </g>
  );
}
