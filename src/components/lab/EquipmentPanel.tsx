'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EquipmentType } from "@/lib/types";
import { Beaker, FlaskRound, Flame, Droplet ,Pipette,Cylinder,Gauge,Cpu} from "lucide-react";
import BeakerImage from "@/assets/beaker.svg";
import FlaskImage from "@/assets/flask.svg";
import StorageTankImage from "@/assets/round_storage_tank.svg";
import PipeImage from "@/assets/pipe.svg";
import ValveImage from '@/assets/valve.svg';
import TValveImage from "@/assets/T_valve.svg";
import CompressorImage from "@/assets/compressor.svg";
import ReactorImage from '@/assets/reactor.svg';
import Image from "next/image";
interface EquipmentPanelProps {
  onAddItem: (type: EquipmentType) => void;
}

const equipmentList: {
  type: EquipmentType;
  name: string;
  icon: React.ReactNode;
}[] = [
  {
    type: "beaker",
    name: "Beaker",
    icon: (
      <Image
        src={BeakerImage}
        alt="Beaker"
        width={24}
        height={24}
      />
    ),
  },
  {
    type: "flask",
    name: "Flask",
    icon: (
      <Image
        src={FlaskImage}
        alt="Flask"
        width={24}
        height={24}
      />
    ),
  },
  { type: "burner", name: "Burner", icon: <Flame className="w-6 h-6" /> },
  { type: "burette", name: "Burette", icon: <Pipette className="w-6 h-6" /> },

  {
    type: "storagetank",
    name: "Storage Tank",
    icon: (
      <Image
        src={StorageTankImage}
        alt="Storage Tank"
        width={24}
        height={24}
      />
    ),
  },
  {
    type: "pipe",
    name: "Pipe",
    icon: (
      <Image
        src={PipeImage}
        alt="Pipe"
        width={24}
        height={24}
      />
    ),
  },
  {
    type: "elbow",
    name: "Elbow",
    icon: (
      <Image
        src={ValveImage}
        alt="Elbow Pipe"
        width={24}
        height={24}
      />
    ),
  },
  { type: "meter", name: "Meter", icon: <Gauge className="w-6 h-6" /> },

  {
    type: "tvalve",
    name: "T-Valve",
    icon: (
      <Image
        src={TValveImage}
        alt="T Valve"
        width={24}
        height={24}
      />
    ),
  },
  { type: "compressor", name: "Compressor", icon: <Image
        src={CompressorImage}
        alt="Compressor"
        width={24}
        height={24}
      /> },
      {
    type: "reactor",
    name: "Reactor",
    icon: (
      <Image
        src={ReactorImage}
        alt="Reactor"
        width={24}
        height={24}
      />
    ),
  },
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
