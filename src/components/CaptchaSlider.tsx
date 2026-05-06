"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useChaos } from "@/context/chaos-context";
import { cn } from "@/lib/utils";
import { soundManager } from "@/lib/sound-manager";

interface CaptchaSliderProps {
  onSelect: (hasSelection: boolean) => void;
}

export const CaptchaSlider: React.FC<CaptchaSliderProps> = ({ onSelect }) => {
  const { incrementChaos, chaosLevel } = useChaos();
  const [sliderValue, setSliderValue] = useState(0);
  const sm = soundManager.getInstance();
  const trackRef = useRef<HTMLDivElement>(null);
  
  // A completely absurd text for the "track" background
  const absurdTrackText = "THE_VOID_CONSUMES_ALL_DATA_DO_NOT_FALTER_IN_THE_FACE_OF_OBLIVION";

  useEffect(() => {
    // Treat any movement as a valid "selection" to allow the user to proceed,
    // even though the slider makes no logical sense.
    if (sliderValue > 0) {
      onSelect(true);
    }
  }, [sliderValue, onSelect]);

  const handleDrag = (event: any, info: any) => {
    if (!trackRef.current) return;
    const trackWidth = trackRef.current.offsetWidth;
    const newPos = Math.max(0, Math.min(info.point.x, trackWidth));
    const percentage = (newPos / trackWidth) * 100;
    
    setSliderValue(percentage);
    
    // Play a weird pitch-shifted hum sound
    if (Math.random() > 0.8) {
      sm.play("hover");
      incrementChaos(0.5);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6 select-none">
      <div className="text-sm font-medium text-slate-700 text-center font-mono leading-relaxed">
        Align the conceptual frequency to proceed.
      </div>
      
      <div className="relative w-full h-16 rounded-lg bg-slate-100 border border-slate-300 overflow-hidden" ref={trackRef}>
        {/* Absurd Track Background */}
        <div className="absolute inset-0 flex items-center overflow-hidden opacity-30 text-[10px] font-mono leading-none break-all text-justify pointer-events-none text-slate-800 p-1">
          {absurdTrackText.repeat(10)}
        </div>
        
        {/* Moving Glitch Line */}
        <motion.div 
          className="absolute top-0 bottom-0 w-1 bg-red-500/50 mix-blend-multiply"
          animate={{ x: ["0%", "100%", "0%"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />

        {/* The Thumb */}
        <motion.div
          drag="x"
          dragConstraints={trackRef}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "absolute top-1 bottom-1 w-14 rounded-md shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-xl bg-white border-2",
            chaosLevel > 60 ? "border-red-500" : "border-slate-800"
          )}
          style={{ 
            x: `calc(${sliderValue}% - 28px)`,
            filter: `hue-rotate(${sliderValue * 3.6}deg)`
          }}
        >
          👁️
        </motion.div>
      </div>

      <div className="flex justify-between w-full text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest px-1">
        <span>Sorrow</span>
        <span>Acceptance</span>
      </div>
    </div>
  );
};
