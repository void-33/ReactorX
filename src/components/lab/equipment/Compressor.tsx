import React from "react";
import { LabItem } from "@/lib/types";

export default function Compressor({ contents, isHeating, rotation = 90}: LabItem) {
    return (
			<div style={{ transform: `rotate(${rotation}deg)` }}>
        <svg width="210" height="297" viewBox="0 0 210 297" fill="#fff">
            <g transform="matrix(6.4781 0 0 6.0985 -105.78 -25.629)" fillOpacity="0" stroke="#fff">
                <rect x="22.019" y="9.1945" width="20.024" height="39.572" ry="2.6656" strokeWidth="1"  />
                <path d="m25.686 9.2563v39.386" strokeWidth="1"  />
                <path d="m38.376 9.2563v39.386" strokeWidth="1"  />
                <g strokeWidth="1">
                    <path d="m27.956 9.2563v-3.7717"  />
                    <path d="m35.756 9.2563v-3.7717"  />
                </g>
                <g transform="translate(0 42.972)" strokeWidth="1">
                    <path d="m27.956 9.2563v-3.7717"  />
                    <path d="m35.756 9.2563v-3.7717"  />
                </g>
            </g>
        </svg>
			</div>

    );
}