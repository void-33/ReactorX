// src/lib/procedures/index.ts
import { Step, Procedure } from "@/lib/types";
import { ammoniaProcedure } from "@/procedures/nh3";

export const procedures: Procedure[] = [
  {
    id: "ammonia",
    name: "Haber's Process",
    steps: ammoniaProcedure,
  },
];
