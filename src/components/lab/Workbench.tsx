'use client';

import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import type { LabItem } from '@/lib/types';
import Beaker from './equipment/Beaker';
import Flask from './equipment/Flask';
import Burner from './equipment/Burner';
import { X } from 'lucide-react';

interface WorkbenchProps {
  items: LabItem[];
  onDragEnd: (id: string, info: PanInfo) => void;
  onItemClick: (id: string) => void;
  onRemoveItem: (id: string) => void;
  itemRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
}

const equipmentMap = {
  beaker: Beaker,
  flask: Flask,
  burner: Burner,
};

const Workbench = React.forwardRef<HTMLDivElement, WorkbenchProps>(
  ({ items, onDragEnd, onItemClick, onRemoveItem, itemRefs }, ref) => {
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
              ref={(el) => void itemRefs.current.set(item.id, el)}
              drag={item.isDraggingEnabled ?? true}
              dragMomentum={false}
              onDragEnd={(_, info) => onDragEnd(item.id, info)}
              onClick={() => onItemClick(item.id)}
              initial={{ x: item.position.x, y: item.position.y }}
              animate={{ x: item.position.x, y: item.position.y }}
              transition={{ type: 'spring', stiffness: 500, damping: 50 }}
              className={`absolute z-10 ${
                item.isDraggingEnabled !== false ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
              } ${item.isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              whileDrag={{ scale: 1.1, zIndex: 20 }}
            >
              {item.isSelected && (
                <div
                  className="absolute -top-2 -right-2 z-20 bg-destructive text-destructive-foreground rounded-full p-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.id);
                  }}
                >
                  <X size={16} />
                </div>
              )}
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
