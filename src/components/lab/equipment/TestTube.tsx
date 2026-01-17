'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { LabItem } from '@/lib/types';

export default function TestTube({ contents, isHeating }: LabItem) {
  const tubePathRef = useRef<SVGPathElement | null>(null);

  // Max capacity of a standard test tube is much smaller than a beaker
  const MAX_VOLUME = 100; 
  const content_volume = Math.min((contents?.volume || 0), MAX_VOLUME);
  const fillRatio = content_volume / MAX_VOLUME;

  const [bbox, setBBox] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Calculate the height of the liquid based on the bounding box
  const contentHeight = Math.max(0, bbox.height * fillRatio);
  const contentY = bbox.y + bbox.height - contentHeight;

  useEffect(() => {
    const update = () => {
      const tubePath = tubePathRef.current;
      if (tubePath) {
        const b = tubePath.getBBox();
        setBBox({
          x: b.x,
          y: b.y,
          width: b.width,
          height: b.height
        });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <svg width="60" height="150" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* The clipPath defines the inside area of the test tube */}
        <clipPath id="tube-mask">
          <path d="M35 20 H65 V160 C65 173.8 58.2 185 50 185 C41.8 185 35 173.8 35 160 Z" />
        </clipPath>
      </defs>

      {/* Liquid Layer */}
      <rect 
        x={bbox.x} 
        y={contentY} 
        width={bbox.width} 
        height={contentHeight} 
        fill={contents?.color || 'blue'} 
        clipPath="url(#tube-mask)" 
        // className="transition-all duration-500 ease-in-out"
      />

      {/* Main Test Tube Path */}
      <path
        ref={tubePathRef}
        d="M30 15 H70 M35 15 V160 C35 176.5 41.7 190 50 190 C58.3 190 65 176.5 65 160 V15"
        stroke="currentColor"
        fillRule="evenodd"
        strokeWidth="2.0"
        strokeLinecap="round"
        fill="rgba(255, 255, 255, 0.1)"
        className="text-foreground/40"
      />

      {/* Measurement Markings */}
      <g stroke="currentColor" strokeWidth="1" className="opacity-30 text-foreground">
        <line x1="35" y1="50" x2="45" y2="50" />
        <line x1="35" y1="85" x2="45" y2="85" />
        <line x1="35" y1="120" x2="45" y2="120" />
        <line x1="35" y1="155" x2="45" y2="155" />
      </g>

      {/* Heating Effect (Optional: add bubbles or glow if isHeating is true) */}
      {isHeating && (
        <circle cx="50" cy="170" r="10" fill="orange" className="animate-pulse blur-xl opacity-50" />
      )}
    </svg>
  );
}