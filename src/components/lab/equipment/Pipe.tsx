import React from "react";

import type { LabItem } from '@/lib/types';

export default function Pipe({ rotation = 0 }: LabItem) {
    return (
        <div style={{ transform: `rotate(${rotation}deg)` }}>
            <svg width={80} height={250} viewBox="0 0 80 250">
                <rect x="15" y="15" width="50" height="220" fillOpacity="0" stroke="#fff" strokeWidth="7" />
            </svg>
        </div>
    );
}