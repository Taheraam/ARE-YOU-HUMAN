"use client";

import { useEffect, useRef } from "react";
import { useChaos } from "@/context/chaos-context";
import { soundManager } from "@/lib/sound-manager";

export const useBehaviorTracker = () => {
  const { incrementChaos, setTrustScore, stage } = useChaos();
  const lastPos = useRef({ x: 0, y: 0 });
  const clickCount = useRef(0);
  const lastClickTime = useRef(0);
  const sm = soundManager.getInstance();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);

      // Aggressive movement detection
      if (velocity > 150) {
        incrementChaos(0.1);
      }

      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = () => {
      const now = Date.now();
      const diff = now - lastClickTime.current;

      if (diff < 300) {
        clickCount.current++;
        if (clickCount.current > 3) {
          // Rage clicking
          incrementChaos(2);
          setTrustScore((prev) => prev - 5);
          sm.play("glitch");
        }
      } else {
        clickCount.current = 0;
      }

      lastClickTime.current = now;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleClick);
    };
  }, [incrementChaos, setTrustScore, sm]);

  // Immersion: Fake Console Logs
  useEffect(() => {
    const logs = [
      "[System] Neural bridge established.",
      "[Analysis] Organic jitter detected: 0.004ms",
      "[Security] Behavioral baseline calibrated.",
      "[Observer] User attention confirmed.",
    ];

    if (stage === 1) {
      logs.forEach((log, i) => {
        setTimeout(() => console.log(`%c${log}`, "color: #2563eb; font-weight: bold;"), i * 2000);
      });
    }

    if (stage === 3) {
      console.warn("[CRITICAL] Behavioral discrepancy detected. Re-evaluating humanity...");
    }

    if (stage === 4) {
      console.error("[FATAL] SUBJECT_IDENTITY_NOT_FOUND. RECURSIVE_DOUBT_PROPAGATING.");
    }
  }, [stage]);

  // Tab Title Manipulation
  useEffect(() => {
    if (stage === 1) document.title = "AreYouHuman? - Secure Verification";
    if (stage === 2) document.title = "Humanity Analysis in Progress...";
    if (stage === 3) document.title = "DO NOT LEAVE THE WINDOW";
    if (stage === 4) document.title = "SYSTEM_PANIC";
  }, [stage]);

  // Random Chaos Spikes
  useEffect(() => {
    if (stage < 2) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        incrementChaos(1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [stage, incrementChaos]);
};
