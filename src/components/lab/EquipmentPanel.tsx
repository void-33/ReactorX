'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EquipmentType } from "@/lib/types";
import { Beaker, FlaskRound, Flame, Droplet } from "lucide-react";

interface EquipmentPanelProps {
  onAddItem: (type: EquipmentType) => void;
}

const equipmentList: { type: EquipmentType, name: string, icon: React.ReactNode }[] = [
  { type: 'beaker', name: 'Beaker', icon: <Beaker /> },
  { type: 'flask', name: 'Flask', icon: <FlaskRound /> },
  { type: 'burner', name: 'Burner', icon: <Flame /> },
  { type: 'burette', name: 'Burette', icon: <Droplet /> },
  {type: 'storagetank', name:'Storage Tank',icon: <Droplet/>},
  {type: 'pipe', name:'Pipe', icon: <Droplet/>},
  {type:'elbow', name:'Elbow', icon:<Droplet/>},
  {type:'meter', name:'Meter', icon:<Droplet/>},
  {type:'tvalve', name:'Tvalve', icon:<Droplet/>},
  {type:'compressor',name:'Compressor', icon:<Droplet/>}
];

export default function EquipmentPanel({ onAddItem }: EquipmentPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {equipmentList.map(({ type, name, icon }) => (
            <Button
              key={type}
              variant="secondary"
              className="flex flex-col h-24 gap-2 items-center justify-center"
              onClick={() => onAddItem(type)}
            >
              {icon}
              <span className="text-xs">{name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
