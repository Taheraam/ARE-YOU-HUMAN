"use client";

import React, { useEffect, useRef } from "react";
import { useChaos } from "@/context/chaos-context";

export const MatrixRain: React.FC = () => {
  const { showMatrixRain } = useChaos();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!showMatrixRain) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+{}|[]\\;':\",./<>?~`".split("");
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    let frame = 0;

    const draw = () => {
      // Glitchy clearing: mostly semi-transparent black, occasionally fully black
      ctx.fillStyle = Math.random() > 0.95 ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Red rain for high chaos
      ctx.fillStyle = Math.random() > 0.8 ? "#f87171" : "#dc2626"; 
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Randomly skip some draws for a glitchy look
        if (Math.random() > 0.1) {
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        }

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Random speed variance
        drops[i] += Math.random() > 0.8 ? 2 : 1;
      }
      
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, [showMatrixRain]);

  if (!showMatrixRain) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-40 pointer-events-none opacity-60 mix-blend-screen"
      style={{ filter: "contrast(1.5) brightness(1.2)" }}
    />
  );
};
