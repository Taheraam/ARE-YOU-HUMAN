import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChaos } from "@/context/chaos-context";
import { soundManager } from "@/lib/sound-manager";
import { Check, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CaptchaGrid } from "./CaptchaGrid";
import { CaptchaQuestion } from "./CaptchaQuestion";
import { CaptchaSlider } from "./CaptchaSlider";

const STEPS = [
  { type: "checkbox" },
  { type: "grid", q: "Select all images containing a traffic light.", tiles: ['🚦','🌳','🐕','🚗','🚦','🌊','🚦','🏠','🌙'] },
  { type: "grid", q: "Select all images that contain regret.", tiles: ['😬','📱','💌','🪑','😶','🎲','😬','🧻','💸'], absurd: true },
  { type: "question", q: "Which of the following best describes your current emotional state?", opts: ['I am fine.','I am slightly unsettled.','I cannot tell anymore.','This question feels personal.'] },
  { type: "slider" },
  { type: "grid", q: "Select the shape that is lying.", tiles: ['◻️','🔺','⭕','◻️','🔻','⭕','🔷','◻️','🔺'], absurd: true },
  { type: "question", q: "Evaluate: ∫ (e^(-x^2) / x) dx from 0 to ∞", opts: ['The limit does not exist, much like my purpose.','0, because nothing truly matters.','π, but only if observed.','I am sorry for whatever I did.'] },
  { type: "question", q: "Prove free will exists. Select your answer below.", opts: ['I choose to click this.','I was always going to click this.','The question is a paradox.','I need a moment.'] },
  { type: "checkbox", jittery: true } // Final impossible checkbox
];


export const VerificationCard: React.FC = () => {
  const { chaosLevel, stage, captchaStep, incrementChaos, setTrustScore, nextStep, triggerCrash, isCrashed, triggerMatrixRain } = useChaos();
  const [isChecked, setIsChecked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
  const [hasSelection, setHasSelection] = useState(false);
  const sm = soundManager.getInstance();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentStepData = STEPS[Math.min(captchaStep, STEPS.length - 1)];
  const isFinalStep = captchaStep >= STEPS.length - 1;

  // Reset selection state when step changes
  useEffect(() => {
    setHasSelection(false);
    setIsChecked(false);
  }, [captchaStep]);

  const handleVerify = () => {
    if (isVerifying || isSuccess || isCrashed) return;

    if (currentStepData.type === "checkbox" && !isChecked && !currentStepData.jittery) {
      sm.play("glitch");
      incrementChaos(5);
      return;
    }

    if ((currentStepData.type === "grid" || currentStepData.type === "question" || currentStepData.type === "slider") && !hasSelection) {
      sm.play("glitch");
      incrementChaos(8);
      return;
    }

    sm.play("click");
    setIsVerifying(true);

    if (isFinalStep) {
      // The final step triggers the crash after a suspenseful loading
      setTimeout(() => {
        triggerCrash();
      }, 3000);
      return;
    }

    // Trigger Matrix Rain on step 6 and 7
    if (captchaStep === 6 || captchaStep === 7) {
      triggerMatrixRain(2000);
    }

    // Normal progression logic
    const delay = 1000 + (chaosLevel * 20);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      sm.play("success");
      incrementChaos(10); 

      // Move to next step
      setTimeout(() => {
        setIsSuccess(false);
        setIsChecked(false);
        setHasSelection(false);
        nextStep();
        sm.play("hover");
      }, 2000 - (chaosLevel * 10));
    }, delay);
  };

  // Intense cursor evasion for the final jittery checkbox
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isVerifying || isSuccess || isCrashed) return;
    if (!buttonRef.current) return;
    if (!currentStepData.jittery && stage < 3) return; // Only evade on high chaos or final step

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const evadeRadius = currentStepData.jittery ? 300 : 150;
    const forceMulti = currentStepData.jittery ? 0.8 : 0.2;

    if (dist < evadeRadius) {
      const force = (evadeRadius - dist) / 10;
      setButtonPos({
        x: -dx * force * forceMulti,
        y: -dy * force * forceMulti
      });
      if (Math.random() > 0.9) incrementChaos(0.5);
    } else {
      setButtonPos({ x: 0, y: 0 });
    }
  };

  if (isCrashed) return null; // Let the full screen crash take over

  return (
    <motion.div
      layout
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-200 transition-all duration-300 z-10",
        stage >= 2 && "stage-2-blur",
        stage >= 3 && "stage-3-shake border-red-200 shadow-red-100",
        stage >= 4 && "bg-slate-950 border-red-900 shadow-red-900/50"
      )}
      style={{
        transform: stage >= 3 ? `translate(${(Math.random() - 0.5) * (chaosLevel / 10)}px, ${(Math.random() - 0.5) * (chaosLevel / 10)}px)` : undefined
      }}
    >
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <ShieldCheck className={cn("w-6 h-6", isSuccess ? "text-green-500" : stage >= 4 ? "text-red-600" : "text-blue-600")} />
            <span className={cn("font-semibold transition-colors", stage >= 4 ? "text-red-500 font-mono" : "text-slate-800")}>
              {stage >= 4 ? "EXISTENTIAL_VOID" : "Identity Verification"}
            </span>
          </div>
          <div className={cn("text-[10px] uppercase tracking-widest font-bold", stage >= 4 ? "text-red-800" : "text-slate-400")}>
            {stage >= 4 ? "vNULL-ERROR" : `Step ${Math.min(captchaStep + 1, STEPS.length)} of ${STEPS.length}`}
          </div>
        </div>

        <div className={cn("w-full h-[1px]", stage >= 4 ? "bg-red-900/30" : "bg-slate-100")} />

        <div className="py-2 flex flex-col items-center space-y-4 w-full min-h-[160px] justify-center">
          
          <AnimatePresence mode="wait">
            {!isVerifying && !isSuccess && (
              <motion.div 
                key={`step-${captchaStep}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full"
              >
                {currentStepData.type === "grid" && (
                  <CaptchaGrid question={currentStepData.q!} tiles={currentStepData.tiles!} isAbsurd={currentStepData.absurd} onSelect={setHasSelection} />
                )}
                {currentStepData.type === "question" && (
                  <CaptchaQuestion question={currentStepData.q!} options={currentStepData.opts!} onSelect={setHasSelection} />
                )}
                {currentStepData.type === "slider" && (
                  <CaptchaSlider onSelect={setHasSelection} />
                )}

                {currentStepData.type === "checkbox" && (
                  <div className="flex justify-center py-6">
                    <button 
                      className={cn(
                        "flex items-center space-x-3 group",
                        currentStepData.jittery && "animate-pulse"
                      )}
                      onClick={() => {
                        setIsChecked(!isChecked);
                        if (currentStepData.jittery) incrementChaos(5);
                      }}
                    >
                      <div className={cn(
                        "w-6 h-6 border-2 rounded-md flex items-center justify-center transition-colors",
                        isChecked ? "bg-blue-500 border-blue-500" : "border-slate-300 group-hover:border-blue-400",
                        currentStepData.jittery && "border-red-500 bg-red-50/10"
                      )}>
                        {isChecked && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className={cn(
                        "font-medium text-slate-600",
                        currentStepData.jittery && "text-red-500 font-mono"
                      )}>
                        {currentStepData.jittery ? "I AM NOT A MACHINE" : "I am human"}
                      </span>
                    </button>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            ref={buttonRef}
            animate={{ x: buttonPos.x, y: buttonPos.y }}
            whileHover={{ scale: stage >= 3 ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVerify}
            className={cn(
              "group relative flex items-center justify-center w-full max-w-[250px] h-12 rounded-xl border-2 transition-all duration-500 overflow-hidden",
              isSuccess ? "bg-green-50 border-green-500" : 
              isVerifying ? (stage >= 4 ? "bg-red-950/20 border-red-900" : "bg-slate-50 border-slate-300") : 
              (stage >= 4 ? "bg-black border-red-900" : "bg-white border-slate-200 hover:border-blue-400")
            )}
          >
            <AnimatePresence mode="wait">
              {isVerifying ? (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn("flex items-center space-x-2 text-sm", stage >= 4 ? "text-red-600 font-mono" : "text-slate-500")}
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="font-medium">
                    {stage >= 4 ? "ANALYZING_VOID..." : "Verifying..."}
                  </span>
                </motion.div>
              ) : isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 text-green-600 text-sm"
                >
                  <Check className="w-4 h-4" />
                  <span className="font-medium">Verified</span>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn("font-medium text-sm transition-colors", stage >= 4 ? "text-red-600 font-mono" : "text-slate-700")}
                >
                  {isFinalStep ? "SUBMIT FINAL ANALYSIS" : "Verify →"}
                </motion.div>
              )}
            </AnimatePresence>

            {isVerifying && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: isFinalStep ? 3 : 2, ease: "linear" }}
                className={cn("absolute bottom-0 left-0 h-1", stage >= 4 ? "bg-red-600" : "bg-blue-500")}
              />
            )}
          </motion.button>
        </div>

        {/* Progress Bar overall */}
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-4">
          <motion.div 
            className={cn("h-full", stage >= 4 ? "bg-red-600" : "bg-blue-500")}
            initial={{ width: `${(captchaStep / STEPS.length) * 100}%` }}
            animate={{ width: `${((captchaStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {stage >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 text-xs w-full justify-center"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{stage === 2 ? "High latency detected in organic response." : "Neural confidence dropping below baseline."}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
