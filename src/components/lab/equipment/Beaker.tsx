'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { LabItem } from '@/lib/types';
import Liquid from './shared/Liquid';

export default function Beaker({ contents, isHeating }: LabItem) {
  const liquidLevel = contents ? Math.min(contents.volume / 100, 1) : 0;

  return (
    <div className="relative w-24 h-24">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* Liquid */}
        {contents && liquidLevel > 0 && (
          <Liquid
            color={contents.color}
            level={liquidLevel}
            isHeating={isHeating}
            shape="rect"
          />
        )}
        {/* Beaker Glass */}
        <path
          d="M15 10 L15 90 H85 L85 10"
          stroke="hsl(var(--foreground) / 0.3)"
          strokeWidth="3"
          fill="hsl(var(--card) / 0.1)"
        />
        {/* Top Rim */}
        <path d="M10 10 H90" stroke="hsl(var(--foreground) / 0.3)" strokeWidth="3" fill="none" />
      </svg>
    </div>
  );
}
