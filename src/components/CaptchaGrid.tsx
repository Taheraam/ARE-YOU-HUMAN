


"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useChaos } from "@/context/chaos-context";
import { cn } from "@/lib/utils";
import { soundManager } from "@/lib/sound-manager";

interface CaptchaGridProps {
  question: string;
  tiles: string[];
  isAbsurd?: boolean;
  onSelect: (hasSelection: boolean) => void;
}

export const CaptchaGrid: React.FC<CaptchaGridProps> = ({ question, tiles, isAbsurd, onSelect }) => {
  const { chaosLevel, incrementChaos } = useChaos();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const sm = soundManager.getInstance();

  const toggleTile = (index: number) => {
    sm.play("click");
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      onSelect(next.size > 0);
      return next;
    });
    incrementChaos(isAbsurd ? 2 : 1);
  };


  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className={cn(
        "text-sm font-medium text-slate-700 text-center max-w-[250px]",
        isAbsurd && "font-mono"
      )}>
        {question}
      </div>
      <div className="grid grid-cols-3 gap-2 w-full max-w-[280px]">
        {tiles.map((tile, i) => {
          const isSelected = selected.has(i);
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleTile(i)}
              className={cn(
                "aspect-square rounded-md border-2 cursor-pointer flex items-center justify-center text-3xl transition-all duration-200 select-none bg-slate-50",
                isSelected ? "border-blue-500 bg-blue-50" : "border-transparent hover:bg-slate-100",
                isAbsurd && isSelected && "border-red-500 bg-red-50"
              )}
            >
              <span>{tile}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
