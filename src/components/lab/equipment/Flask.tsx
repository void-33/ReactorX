'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { LabItem } from '@/lib/types';
import Liquid from './shared/Liquid';

export default function Flask({ contents, isHeating }: LabItem) {
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
            shape="trapezoid"
          />
        )}
        {/* Flask Glass */}
        <path
          d="M40 10 L40 30 L20 90 H80 L60 30 L60 10"
          stroke="hsl(var(--foreground) / 0.3)"
          strokeWidth="3"
          fill="hsl(var(--card) / 0.1)"
        />
        <path d="M35 10 H65" stroke="hsl(var(--foreground) / 0.3)" strokeWidth="3" fill="none" />
      </svg>
    </div>
  );
}
