import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Siren,
  Users,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

export default function Loading({ onFinish }) {
  const [isOpening, setIsOpening] = useState(false);
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  const loadingTexts = [
    "Scanning Nearby Responders...",
    "Activating Community Network...",
    "Preparing Emergency Dashboard...",
  ];

  useEffect(() => {
    const duration = 1500; 
    const interval = 16; 
    const totalSteps = duration / interval;
    const increment = 100 / totalSteps;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    const finishTimer = setTimeout(() => {
      setIsOpening(true);
      onFinish();
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  
  useEffect(() => {
    const t = setInterval(
      () => setTextIndex((i) => (i + 1) % loadingTexts.length),
      900
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 z-[999] bg-[#04050c] text-slate-200 overflow-hidden">
      <div className="absolute inset-0 flex perspective-[2600px]">

        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: isOpening ? 0 : 1,
            scale: isOpening ? 0.82 : 1,
            filter: isOpening ? "blur(24px)" : "blur(0px)",
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center"
        >

          <div className="relative w-52 h-52 mb-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-slate-800/70 border-dashed"
            />

            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="104"
                cy="104"
                r="96"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-slate-800/70"
              />
              <motion.circle
                cx="104"
                cy="104"
                r="96"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 96}
                strokeDashoffset={2 * Math.PI * 96 * (1 - progress / 100)}
                strokeLinecap="round"
                className="text-red-500"
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Siren className="mb-3 text-red-400" />
              <div className="text-5xl font-mono font-bold text-white tracking-tight">
                {Math.floor(progress)}%
              </div>
              <span className="text-[10px] uppercase tracking-[0.35em] text-slate-500 mt-1">
                Emergency Sync
              </span>
            </div>
          </div>

          <h1 className="text-5xl font-black tracking-[0.18em] uppercase mb-6">
            <span className="text-red-500">
              NearHelp
            </span>
          </h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-slate-400 tracking-widest italic"
            >
              {loadingTexts[textIndex]}
            </motion.p>
          </AnimatePresence>

          <div className="mt-12 grid grid-cols-3 gap-8">
            <StatusItem icon={<Users size={14} />} label="ALERT" active={progress > 15} />
            <StatusItem icon={<Siren size={14} />} label="ACTIVATE" active={progress > 45} />
            <StatusItem icon={<ShieldAlert size={14} />} label="RESPOND" active={progress > 80} />
          </div>
        </motion.div>

        <div
          className={`absolute left-0 inset-y-0 w-1/2 bg-[#070814] transition-all duration-[1200ms] ease-[cubic-bezier(0.2,1,0.3,1)]
          ${isOpening ? "-translate-x-full -rotate-y-[28deg]" : ""}`}
        />
        <div
          className={`absolute right-0 inset-y-0 w-1/2 bg-[#070814] transition-all duration-[1200ms] ease-[cubic-bezier(0.2,1,0.3,1)]
          ${isOpening ? "translate-x-full rotate-y-[28deg]" : ""}`}
        />
      </div>
    </div>
  );
}

function StatusItem({ icon, label, active }) {
  return (
    <div
      className={`flex flex-col items-center gap-2 transition-all duration-700 ${
        active ? "opacity-100" : "opacity-25 grayscale"
      }`}
    >
      <div
        className={`p-3 rounded-full border ${
          active
            ? "bg-red-500/10 border-red-500/50 text-red-500"
            : "bg-slate-900 border-slate-800 text-slate-600"
        }`}
      >
        {active ? <CheckCircle2 size={16} /> : icon}
      </div>
      <span className="text-[9px] tracking-widest uppercase text-slate-500">
        {label}
      </span>
    </div>
  );
} 