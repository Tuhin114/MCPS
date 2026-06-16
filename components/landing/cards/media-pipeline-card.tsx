"use client";

import { useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";

const PIPELINE_STEPS = [
  { id: "upload", label: "photo.jpg", sublabel: "Upload", icon: "↑" },
  { id: "encrypt", label: "AES-256", sublabel: "Encrypt", icon: "🔐" },
  { id: "package", label: "8f2a91.enc", sublabel: "Package", icon: "◈" },
  { id: "store", label: "Secure Storage", sublabel: "Store", icon: "⬡" },
  {
    id: "access",
    label: "Authorized User",
    sublabel: "Access Granted",
    icon: "✓",
  },
];

function HNode({
  step,
  index,
  activeIndex,
  isHovered,
}: {
  step: (typeof PIPELINE_STEPS)[0];
  index: number;
  activeIndex: number;
  isHovered: boolean;
}) {
  const isActive = index === activeIndex;
  const isPast = index < activeIndex;
  return (
    <div className="flex flex-col items-center gap-1.5 relative z-10">
      <motion.div
        animate={{
          boxShadow: isActive
            ? `0 0 ${isHovered ? 30 : 18}px ${isHovered ? 10 : 6}px rgba(245,158,11,${isHovered ? 0.7 : 0.5})`
            : isPast
              ? "0 0 8px 2px rgba(245,158,11,0.25)"
              : "none",
          scale: isActive ? (isHovered ? 1.2 : 1.1) : 1,
        }}
        transition={{ duration: 0.35 }}
        className="w-11 h-11 rounded-2xl border bg-[#0f0a00] flex items-center justify-center text-base select-none"
        style={{
          borderColor: isActive
            ? "rgba(245,158,11,0.9)"
            : isPast
              ? "rgba(245,158,11,0.5)"
              : "rgba(245,158,11,0.15)",
        }}
      >
        <span
          style={{
            color: isActive ? "#f59e0b" : isPast ? "#d97706" : "#4b3a1a",
            transition: "color 0.3s",
          }}
        >
          {step.icon}
        </span>
      </motion.div>
      <motion.div
        animate={{ opacity: isActive || isPast ? 1 : 0.3 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div
          className="text-[9px] font-mono font-semibold leading-tight"
          style={{
            color: isActive ? "#f59e0b" : isPast ? "#d97706" : "#4b3a1a",
          }}
        >
          {step.label}
        </div>
        <div className="text-[8px] text-amber-900/60">{step.sublabel}</div>
      </motion.div>
    </div>
  );
}

function HConnector({
  index,
  activeIndex,
  particleProgress,
  isHovered,
}: {
  index: number;
  activeIndex: number;
  particleProgress: number;
  isHovered: boolean;
}) {
  const isActiveSegment = index === activeIndex - 1;
  const isPastSegment = index < activeIndex - 1;
  const localProgress = isActiveSegment ? particleProgress % 1 : 0;

  return (
    <div
      className="flex items-center justify-center flex-1 h-2 relative"
      style={{ minWidth: 24 }}
    >
      {/* Base track */}
      <div
        className="w-full h-0.5 rounded-full"
        style={{
          background: isPastSegment
            ? "rgba(245,158,11,0.45)"
            : "rgba(245,158,11,0.1)",
          transition: "background 0.3s",
        }}
      />
      {/* Active fill */}
      {isActiveSegment && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 rounded-full"
          style={{
            width: `${localProgress * 100}%`,
            background: "linear-gradient(to right, #f59e0b, #d97706)",
          }}
        />
      )}
      {/* Particle */}
      {isActiveSegment && (
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{
            left: `${localProgress * 100}%`,
            transform: "translate(-50%, -50%)",
            background: "#fbbf24",
            boxShadow: `0 0 ${isHovered ? 10 : 6}px 3px rgba(251,191,36,0.8)`,
          }}
        />
      )}
    </div>
  );
}

export function MediaPipelineCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [particleProgress, setParticleProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const progressRef = useRef(0);
  const speed = isHovered ? 0.013 : 0.008;

  useAnimationFrame(() => {
    progressRef.current += speed;
    const total = PIPELINE_STEPS.length - 1;
    const raw = progressRef.current % total;
    setActiveIndex(Math.floor(raw) + 1);
    setParticleProgress(raw);
  });

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.025 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="relative h-full rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#0c0700] via-[#100900] to-[#0a0600] overflow-hidden p-6 flex flex-col"
      style={{
        boxShadow: isHovered
          ? "0 0 48px 6px rgba(245,158,11,0.14), inset 0 1px 0 rgba(245,158,11,0.08)"
          : "0 0 0 1px rgba(245,158,11,0.06), inset 0 1px 0 rgba(245,158,11,0.04)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 110%, rgba(245,158,11,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
          <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest">
            Protection Pipeline
          </span>
        </div>
        <h3 className="text-lg font-semibold text-amber-100/90">
          Secure Media Pipeline
        </h3>
        <p className="text-xs text-amber-100/40 mt-1">
          Files transform through every stage of protection in real time.
        </p>
      </div>

      {/* Horizontal pipeline */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full flex items-center gap-0">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center flex-1 min-w-0">
              <HNode
                step={step}
                index={i}
                activeIndex={activeIndex}
                isHovered={isHovered}
              />
              {i < PIPELINE_STEPS.length - 1 && (
                <HConnector
                  index={i}
                  activeIndex={activeIndex}
                  particleProgress={particleProgress}
                  isHovered={isHovered}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <motion.div
        className="relative z-10 mt-5 flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-500/10 bg-amber-500/5 w-fit"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[10px] font-mono text-amber-400/70">
          End-to-end encryption active
        </span>
      </motion.div>
    </motion.div>
  );
}
