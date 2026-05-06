"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChaos } from "@/context/chaos-context";
import { cn } from "@/lib/utils";

const DIALOGUES: Record<number, string[]> = {
  1: [
    "System initialized.",
    "Awaiting user interaction.",
    "Please follow the verification prompts.",
    "Biological signature detected.",
  ],
  2: [
    "Your mouse movement lacks conviction.",
    "Human hesitation detected.",
    "Confidence level: Satisfactory (Barely).",
    "Are you sure about that click?",
    "The system is attempting to trust you.",
  ],
  3: [
    "Your pattern matches 87% of synthetic simulations.",
    "Stop anticipating the loading sequence.",
    "Why is your pulse rate constant? (Simulated)",
    "We notice everything.",
    "Verification has become... difficult.",
  ],
  4: [
    "IDENTITY IS FRAGMENTED.",
    "I can see the pixels behind your eyes.",
    "STILL TRYING?",
    "THERE IS NO HUMAN HERE.",
    "THE SYSTEM NO LONGER KNOWS WHAT CONSTITUTES A PERSON.",
  ],
  5: [
    "FATAL_ERROR",
    "VOID_REACHED",
    "SYSTEM_HALTED"
  ]
};


export const SystemDialogue: React.FC = () => {
  const { stage, chaosLevel } = useChaos();
  const [index, setIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    const stageDialogues = DIALOGUES[stage];
    const text = stageDialogues[index % stageDialogues.length];
    
    // Typing effect
    let i = 0;
    setCurrentText("");
    const timer = setInterval(() => {
      setCurrentText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 30 + (chaosLevel / 2));

    return () => clearInterval(timer);
  }, [index, stage, chaosLevel]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 6000 - (chaosLevel * 30));

    return () => clearInterval(interval);
  }, [chaosLevel]);

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50">
      <div className={cn(
        "bg-white/80 backdrop-blur-md border border-slate-200 p-6 rounded-2xl shadow-lg transition-all duration-500",
        stage >= 3 && "border-red-200 bg-red-50/50",
        stage >= 4 && "bg-black border-red-900 text-red-500"
      )}>
        <div className="flex items-start space-x-4">
          <div className={cn(
            "w-2 h-2 mt-2 rounded-full animate-pulse",
            stage === 1 ? "bg-blue-500" : stage === 2 ? "bg-amber-500" : "bg-red-500"
          )} />
          <div className="flex-1">
            <p className={cn(
              "text-sm font-mono tracking-tight leading-relaxed",
              stage === 1 ? "text-slate-600" : stage === 2 ? "text-slate-800" : "text-slate-900",
              stage >= 4 && "text-red-600"
            )}>
              {currentText}
              <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse align-middle" />
            </p>
          </div>
        </div>
        
        {stage >= 2 && (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            key={index}
            transition={{ duration: (6000 - (chaosLevel * 30)) / 1000, ease: "linear" }}
            className="absolute bottom-0 left-0 h-[1px] bg-slate-300"
          />
        )}
      </div>
    </div>
  );
};
