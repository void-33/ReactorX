'use client';

import { Button } from "@/components/ui/button";
import { Save, RotateCcw, FlaskConical } from 'lucide-react';

interface HeaderProps {
  onSave: () => void;
  onReset: () => void;
}

export default function Header({ onSave, onReset }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-2 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <FlaskConical className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-foreground font-headline">ChemSimLab</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onSave}><Save className="mr-2" /> Save</Button>
        <Button variant="destructive" onClick={onReset}><RotateCcw className="mr-2" /> Reset</Button>
      </div>
    </header>
  );
}
