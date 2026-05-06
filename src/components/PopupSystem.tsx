"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChaos } from "@/context/chaos-context";
import { X, ShieldAlert, Brain, Fingerprint, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface Popup {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  x: number;
  y: number;
}

const POPUP_POOL = [
  { title: "Neural Sync Failed", content: "Your brainwave signature is out of phase with our baseline.", icon: <Brain className="w-4 h-4" /> },
  { title: "Suspicious Hesitation", content: "Most humans click 12ms faster. Explain yourself.", icon: <ShieldAlert className="w-4 h-4" /> },
  { title: "Biometric Drift", content: "Cursor trajectory suggests synthetic intent.", icon: <Fingerprint className="w-4 h-4" /> },
  { title: "Emotional Instability", content: "Pulse simulation indicates rising anxiety. Calm down.", icon: <Activity className="w-4 h-4" /> },
];

export const PopupSystem: React.FC = () => {
  const { stage, chaosLevel, incrementChaos } = useChaos();
  const [popups, setPopups] = useState<Popup[]>([]);

  useEffect(() => {
    if (stage < 3) return;

    const spawnInterval = setInterval(() => {
      if (popups.length > 5) return;
      if (Math.random() > 0.7) {
        const item = POPUP_POOL[Math.floor(Math.random() * POPUP_POOL.length)];
        const newPopup: Popup = {
          id: Math.random().toString(),
          ...item,
          x: Math.random() * 60 + 20, // 20% to 80%
          y: Math.random() * 60 + 20,
        };
        setPopups((prev) => [...prev, newPopup]);
      }
    }, 4000 - (chaosLevel * 20));

    return () => clearInterval(spawnInterval);
  }, [stage, chaosLevel, popups.length]);

  const removePopup = (id: string) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
    incrementChaos(0.5);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {popups.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            style={{ left: `${popup.x}%`, top: `${popup.y}%` }}
            className="absolute pointer-events-auto w-64 bg-white shadow-2xl rounded-lg border border-slate-200 overflow-hidden"
          >
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-600">
                {popup.icon}
                <span className="text-[10px] font-bold uppercase tracking-wider">{popup.title}</span>
              </div>
              <button 
                onClick={() => removePopup(popup.id)}
                className="p-1 hover:bg-slate-200 rounded-md transition-colors"
              >
                <X className="w-3 h-3 text-slate-400" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                {popup.content}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
