'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { LabItem } from '@/lib/types';
import { HeartIcon } from 'lucide-react';

export default function Beaker({ contents, isHeating }: LabItem) {
  const beakerPathRef = useRef<SVGPathElement | null>(null);

  //max capacity of beaker
  const MAX_VOLUME = 500;

  const content_volume = Math.min((contents?.volume || 0), MAX_VOLUME);
  // const fillRatio = content_volume / MAX_VOLUME;
  const fillRatio = 0.05;


  const [bbox, setBBox] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const contentHeight = Math.max(0, bbox.height * fillRatio);
  const contentY = bbox.y + bbox.height - contentHeight;

  // to get the bounding points of the beaker path
  useEffect(() => {
    const update = () => {
      const beakerPath = beakerPathRef.current
      if (beakerPath) {
        const b = beakerPath.getBBox();
        setBBox({
          x: b.x,
          y: b.y,
          width: b.width,
          height: b.height
        })
      }
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);

  }, [])





  return (
    <svg width="120" height="150" viewBox="10 40 200 180" fill='#ffffff'>
      <defs>
        <clipPath id='beaker-mask'>
          <path d="m32.57 45.276 11.456 19.12-0.52568 143.91s1.9713 11.039 6.571 16.296c4.5997 5.2568 16.033 9.5937 16.033 9.5937l88.052 0.26284s14.062-4.5997 17.873-9.4623c3.8112-4.8626 6.9653-15.902 6.9653-15.902l-1.0514-145.22 12.222-18.268z" />
        </clipPath>
      </defs>

      {/* reagent */}
      <rect x={bbox.x} y={contentY} width={bbox.width} height={contentHeight} fill='blue' clipPath='url(#beaker-mask)' ></rect>

      {/* main beaker path */}
      <path ref={beakerPathRef} fillRule="evenodd" strokeWidth="2.0" d="m196.24 45.704c0.70133-1.0434 0.76977-2.3948 0.17106-3.5066-0.59872-1.1119-1.7618-1.8047-3.0191-1.8047h-164.21c-1.2572 0-2.4205 0.69263-3.0191 1.8047-0.59871 1.1118-0.53028 2.4631 0.17105 3.5066l13.111 19.663v141.85c0 8.3816 3.3269 16.413 9.2541 22.339 5.9269 5.9269 13.958 9.254 22.339 9.254h80.508c8.3816 0 16.413-3.3269 22.339-9.254 5.927-5.927 9.2541-13.958 9.2541-22.339v-141.85l13.111-19.663zm-149.95 148.63v12.88c0 6.56 2.6086 12.855 7.2441 17.499 4.6441 4.6355 10.939 7.2441 17.499 7.2441h80.508c6.5599 0 12.855-2.6086 17.499-7.2441 4.6356-4.6442 7.2442-10.939 7.2442-17.499v-142.88c0-0.67527 0.1967-1.3342 0.57306-1.8987l10.143-15.207h-151.43l10.143 15.207c0.37636 0.56436 0.57306 1.2145 0.57306 1.8987v20.526h27.369c1.8901 0 3.4211 1.531 3.4211 3.4211 0 1.8902-1.5309 3.4212-3.4211 3.4212h-27.369v13.684h27.369c1.8901 0 3.4211 1.5309 3.4211 3.4211s-1.5309 3.4211-3.4211 3.4211h-27.369v13.684h27.369c1.8901 0 3.4211 1.5309 3.4211 3.4211 0 1.8901-1.5309 3.4211-3.4211 3.4211h-27.369v13.684h27.369c1.8901 0 3.4211 1.5309 3.4211 3.4211s-1.5309 3.4211-3.4211 3.4211h-27.369v13.684h27.369c1.8901 0 3.4211 1.5309 3.4211 3.4211s-1.5309 3.4211-3.4211 3.4211h-27.369v13.684h27.369c1.8901 0 3.4211 1.5309 3.4211 3.4211 0 1.8901-1.5309 3.4211-3.4211 3.4211h-27.369z" />
    </svg>

  );
}
