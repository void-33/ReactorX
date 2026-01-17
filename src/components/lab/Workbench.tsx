'use client';

import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import type { LabItem } from '@/lib/types';
import Beaker from './equipment/Beaker';
import Flask from './equipment/Flask';
import Burner from './equipment/Burner';

interface WorkbenchProps {
  items: LabItem[];
  onDragEnd: (id: string, info: PanInfo) => void;
  itemRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
}

const equipmentMap = {
  beaker: Beaker,
  flask: Flask,
  burner: Burner,
};

const Workbench = React.forwardRef<HTMLDivElement, WorkbenchProps>(
  ({ items, onDragEnd, itemRefs }, ref) => {
    return (
      <div
        ref={ref}
        className="w-full h-full bg-muted/50 rounded-lg border border-dashed relative overflow-hidden shadow-inner"
      >
        {items.map((item) => {
          const EquipmentComponent = equipmentMap[item.type];
          return (
            <motion.div
              key={item.id}
              ref={(el) => itemRefs.current.set(item.id, el)}
              drag
              dragMomentum={false}
              onDragEnd={(_, info) => onDragEnd(item.id, info)}
              initial={{ x: item.position.x, y: item.position.y }}
              animate={{ x: item.position.x, y: item.position.y }}
              transition={{ type: 'spring', stiffness: 500, damping: 50 }}
              className="absolute cursor-grab active:cursor-grabbing z-10"
              whileDrag={{ scale: 1.1, zIndex: 20 }}
            >
              <EquipmentComponent {...item} />
            </motion.div>
          );
        })}
      </div>
    );
  }
);

Workbench.displayName = 'Workbench';
export default Workbench;
