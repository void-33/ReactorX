'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EquipmentType } from "@/lib/types";
import { Beaker, FlaskRound, Flame } from "lucide-react";

interface EquipmentPanelProps {
  onAddItem: (type: EquipmentType) => void;
}

const equipmentList: { type: EquipmentType, name: string, icon: React.ReactNode }[] = [
  { type: 'beaker', name: 'Beaker', icon: <Beaker /> },
  { type: 'flask', name: 'Flask', icon: <FlaskRound /> },
  { type: 'burner', name: 'Burner', icon: <Flame /> },
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
