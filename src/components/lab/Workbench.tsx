'use client';

import React from 'react';
import { motion, PanInfo, MotionValue } from 'framer-motion';
import type { LabItem, Drop as DropType } from '@/lib/types';
import Beaker from './equipment/Beaker';
import Flask from './equipment/Flask';
import Burner from './equipment/Burner';
import Burette from './equipment/Burette';
import Pipe from './equipment/Pipe';
import StorageTank from './equipment/StorageTank';
import Meter from './equipment/Mater';
import Elbow from './equipment/Elbow';
import Drop from './equipment/Drop';
import { X } from 'lucide-react';

interface WorkbenchProps {
	items: LabItem[];
	drops: DropType[];
	onDragEnd: (id: string, info: PanInfo) => void;
	onDrag?: (id: string, info: PanInfo) => void;
	onItemClick: (id: string) => void;
	onWorkbenchClick: (event: React.MouseEvent<HTMLDivElement>) => void;
	onRemoveItem: (id: string) => void;
	onRotatePipe: (id: string) => void;
	itemRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
	motionValues?: Map<string, { x: MotionValue, y: MotionValue }>;
}

const equipmentMap = {
	beaker: Beaker,
	flask: Flask,
	burner: Burner,
	burette: Burette,
	storagetank: StorageTank,
	pipe: Pipe,
	elbow: Elbow,
	meter: Meter,
};

const Workbench = React.forwardRef<HTMLDivElement, WorkbenchProps>(
	({ items, drops, onDragEnd, onDrag, onItemClick, onWorkbenchClick, onRemoveItem, onRotatePipe, itemRefs, motionValues }, ref) => {
		return (
			<div
				ref={ref}
				onClick={onWorkbenchClick}
				className="w-full h-full bg-muted/50 rounded-lg border border-dashed relative overflow-hidden shadow-inner"
			>
				{items.map((item) => {
					const EquipmentComponent = equipmentMap[item.type];
					const mvs = motionValues?.get(item.id);
					return (
						<motion.div
							key={item.id}
							ref={(el) => void itemRefs.current.set(item.id, el)}
							drag={item.isDraggingEnabled ?? true}
							dragMomentum={false}
							onDragEnd={(_, info) => onDragEnd(item.id, info)}
							onDrag={onDrag ? (_, info) => onDrag(item.id, info) : undefined}
							onClick={(e) => {
								e.stopPropagation();
								onItemClick(item.id);
							}}
							style={mvs ? { x: mvs.x, y: mvs.y } : undefined}
							initial={mvs ? false : { x: item.position.x, y: item.position.y }}
							animate={mvs ? undefined : { x: item.position.x, y: item.position.y }}
							transition={{ type: 'spring', stiffness: 500, damping: 50 }}
							className={`absolute z-10 ${item.isDraggingEnabled !== false ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
								} ${item.isSelected && item.type !== 'pipe' && item.type !== 'elbow' ? 'ring-2 ring-primary ring-offset-2' : ''}`}
						// whileDrag={{ scale: item.type === 'pipe' ? 1.0 : 1.1, zIndex: 20 }}
						>
							{item.isSelected && (
								<>
									<div
										className="absolute -top-2 -right-2 z-20 bg-destructive text-destructive-foreground rounded-full p-1 cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
											onRemoveItem(item.id);
										}}
									>
										<X size={16} />
									</div>
									{(item.type === 'pipe' || item.type === 'elbow') && (
										<div
											className="absolute -top-2 -left-2 z-20 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
											onClick={(e) => {
												e.stopPropagation();
												onRotatePipe(item.id);
											}}
											title="Rotate 90°"
										>
											<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
												<path d="M8 3V1l3 3-3 3V5a4 4 0 1 0 4 4h2a6 6 0 1 1-6-6z" />
											</svg>
										</div>
									)}
								</>
							)}
							<EquipmentComponent {...item} />
						</motion.div>
					);
				})}
				{drops.map((drop) => (
					<div
						key={drop.id}
						className="absolute z-30 pointer-events-none"
						style={{
							left: drop.position.x - 10,
							top: drop.position.y - 15,
							width: '20px',
							height: '30px'
						}}
					>
						<div style={{ transform: 'scale(0.1)', transformOrigin: 'top left' }}>
							<Drop />
						</div>
					</div>
				))}
			</div>
		);
	}
);

Workbench.displayName = 'Workbench';
export default Workbench;
