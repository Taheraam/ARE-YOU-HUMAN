"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useChaos } from "@/context/chaos-context";
import { cn } from "@/lib/utils";
import { soundManager } from "@/lib/sound-manager";

interface CaptchaQuestionProps {
  question: string;
  options: string[];
  onSelect: (hasSelection: boolean) => void;
}

export const CaptchaQuestion: React.FC<CaptchaQuestionProps> = ({ question, options, onSelect }) => {
  const { incrementChaos, chaosLevel } = useChaos();
  const [selected, setSelected] = useState<number | null>(null);
  const sm = soundManager.getInstance();

  const selectOption = (index: number) => {
    sm.play("click");
    setSelected(index);
    onSelect(true);
    incrementChaos(2);
  };


  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="text-sm font-medium text-slate-700 text-center max-w-[250px] font-mono leading-relaxed">
        {question}
      </div>
      <div className="flex flex-col w-full space-y-2">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => selectOption(i)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200",
              selected === i 
                ? "border-blue-500 bg-blue-50 text-blue-800" 
                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-600"
            )}
            style={{
              transform: chaosLevel > 60 && selected === i ? `skewX(${(Math.random() - 0.5) * 2}deg)` : undefined
            }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
