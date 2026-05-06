"use client";

import { VerificationCard } from "@/components/VerificationCard";
import { SystemDialogue } from "@/components/SystemDialogue";
import { PopupSystem } from "@/components/PopupSystem";
import { useChaos } from "@/context/chaos-context";
import { useBehaviorTracker } from "@/hooks/use-behavior-tracker";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { soundManager } from "@/lib/sound-manager";

export default function Home() {
  const { stage, chaosLevel, resetChaos, isCrashed } = useChaos();
  const [isFadingToWhite, setIsFadingToWhite] = useState(false);
  const sm = soundManager.getInstance();
  useBehaviorTracker();

  // Handle the crash sequence
  useEffect(() => {
    if (isCrashed) {
      sm.play("glitch");
      const timer = setTimeout(() => {
        setIsFadingToWhite(true);
        setTimeout(() => {
          resetChaos();
          setIsFadingToWhite(false);
        }, 3000); // Wait 3s while white before resetting
      }, 5000); // Show crash screen for 5s

      return () => clearTimeout(timer);
    }
  }, [isCrashed, resetChaos, sm]);

  if (isCrashed) {
    return (
      <main className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden cursor-none">
        <AnimatePresence>
          {!isFadingToWhite && (
            <motion.div
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-red-600 font-mono text-center flex flex-col items-center justify-center p-8 glitch-text"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-pulse">ARE YOU REALLY HUMAN?</h1>
              <p className="text-red-800 text-lg">SYSTEM_FATAL_EXCEPTION: IDENTITY_NOT_FOUND</p>

              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
              <div className="scanline" style={{ background: 'rgba(220, 38, 38, 0.2)' }} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFadingToWhite && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white z-50"
              transition={{ duration: 2 }}
            />
          )}
        </AnimatePresence>
      </main>
    );
  }

  return (
    <main className={cn(
      "relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden transition-colors duration-1000",
      stage === 1 ? "bg-slate-50" :
        stage === 2 ? "bg-slate-100" :
          stage === 3 ? "bg-slate-200" :
            "bg-zinc-950"
    )}>
      <PopupSystem />
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]" />
      </div>

      {/* Visual Glitches */}
      <AnimatePresence>
        {stage >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            className="noise-overlay"
          />
        )}
        {stage >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="scanline"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full flex flex-col items-center space-y-12">
        <header className="text-center space-y-4">
          <motion.h1
            layout
            className={cn(
              "text-4xl md:text-5xl font-bold tracking-tight transition-all duration-500",
              stage >= 3 ? "glitch-text text-slate-900" : "text-slate-900",
              stage >= 4 && "text-white"
            )}
          >
            {stage === 4 ? "SYSTEM_FAILURE" : "AreYouHuman?"}
          </motion.h1>
          <motion.p
            layout
            className={cn(
              "text-slate-500 max-w-md mx-auto transition-colors",
              stage >= 4 && "text-red-500 font-mono"
            )}
          >
            {stage === 1 && "Complete the verification to proceed to the secure portal."}
            {stage === 2 && "Our behavioral analysis system has noted some discrepancies."}
            {stage === 3 && "The system is having trouble reconciling your existence."}
            {stage === 4 && "RECURSIVE_DOUBT_DETECTED"}
          </motion.p>
        </header>

        <VerificationCard />

        {/* Fake Metrics Overlay */}
        {stage >= 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed top-8 right-8 space-y-4 hidden lg:block"
          >
            <Metric label="Humanity Score" value={100 - chaosLevel} color="blue" />
            <Metric label="Trust Baseline" value={Math.max(0, 100 - (chaosLevel * 1.2))} color="green" />
            <Metric label="Neural Jitter" value={chaosLevel} color="red" />
          </motion.div>
        )}
      </div>

      {/* Footer Branding & Controls */}
      <footer className="fixed bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
        <div className="text-[10px] text-slate-400 font-mono">
          © 2026 OMNICORP NEURAL SYSTEMS | ALL RIGHTS OBSERVED
        </div>
        <div className="flex items-center space-x-4 pointer-events-auto">
          <button
            onClick={() => {
              const sm = require("@/lib/sound-manager").soundManager.getInstance();
              sm.toggleMute();
            }}
            className="p-2 bg-white/50 backdrop-blur rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Activity className="w-4 h-4" />
          </button>
          <button
            onDoubleClick={resetChaos}
            className="text-[10px] text-slate-300 hover:text-slate-400 transition-colors cursor-help"
            title="Double click to re-initialize system"
          >
            v4.2.0-stable
          </button>
        </div>
      </footer>
    </main>
  );
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-slate-200 shadow-sm w-48 space-y-2">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={cn(
            "h-full rounded-full",
            color === "blue" ? "bg-blue-500" : color === "green" ? "bg-green-500" : "bg-red-500"
          )}
        />
      </div>
    </div>
  );
}
