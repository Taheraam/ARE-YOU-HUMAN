"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Stage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; // Added stage 5 for crash

interface ChaosContextType {
  chaosLevel: number;
  stage: Stage;
  trustScore: number;
  captchaStep: number;
  isCrashed: boolean;
  incrementChaos: (amount: number) => void;
  setTrustScore: (score: number | ((prev: number) => number)) => void;
  nextStep: () => void;
  triggerCrash: () => void;
  resetChaos: () => void;
}

const ChaosContext = createContext<ChaosContextType | undefined>(undefined);

export const ChaosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chaosLevel, setChaosLevel] = useState(0);
  const [trustScore, setTrustScoreState] = useState(100);
  const [stage, setStage] = useState<Stage>(1);
  const [captchaStep, setCaptchaStep] = useState(0);
  const [isCrashed, setIsCrashed] = useState(false);

  // Sync stage with chaosLevel, but if crashed, force stage 5
  useEffect(() => {
    if (isCrashed) {
      setStage(5);
      return;
    }
    if (chaosLevel < 25) setStage(1);
    else if (chaosLevel < 55) setStage(2);
    else if (chaosLevel < 85) setStage(3);
    else setStage(4);
  }, [chaosLevel, isCrashed]);

  const incrementChaos = useCallback((amount: number) => {
    if (!isCrashed) {
      setChaosLevel((prev) => Math.min(prev + amount, 100));
    }
  }, [isCrashed]);

  const setTrustScore = useCallback((score: number | ((prev: number) => number)) => {
    setTrustScoreState((prev) => {
      const next = typeof score === "function" ? score(prev) : score;
      return Math.max(0, Math.min(100, next));
    });
  }, []);

  const nextStep = useCallback(() => {
    setCaptchaStep((prev) => prev + 1);
  }, []);

  const triggerCrash = useCallback(() => {
    setIsCrashed(true);
    setChaosLevel(100);
  }, []);

  const resetChaos = useCallback(() => {
    setChaosLevel(0);
    setTrustScoreState(100);
    setStage(1);
    setCaptchaStep(0);
    setIsCrashed(false);
    localStorage.removeItem("are-you-human-state");
  }, []);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("are-you-human-state");
    if (saved) {
      try {
        const { chaosLevel: cl, trustScore: ts, captchaStep: cs } = JSON.parse(saved);
        setChaosLevel(cl || 0);
        setTrustScoreState(ts || 100);
        setCaptchaStep(cs || 0);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!isCrashed) {
      localStorage.setItem(
        "are-you-human-state",
        JSON.stringify({ chaosLevel, trustScore, captchaStep })
      );
    }
  }, [chaosLevel, trustScore, captchaStep, isCrashed]);

  return (
    <ChaosContext.Provider
      value={{
        chaosLevel,
        stage,
        trustScore,
        captchaStep,
        isCrashed,
        incrementChaos,
        setTrustScore,
        nextStep,
        triggerCrash,
        resetChaos,
      }}
    >
      {children}
    </ChaosContext.Provider>
  );
};

export const useChaos = () => {
  const context = useContext(ChaosContext);
  if (!context) {
    throw new Error("useChaos must be used within a ChaosProvider");
  }
  return context;
};
