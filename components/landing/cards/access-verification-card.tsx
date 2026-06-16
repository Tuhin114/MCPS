"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";

const STEPS = [
  { id: "request", label: "Access Request", icon: "→" },
  { id: "auth", label: "Authentication", icon: "🔑" },
  { id: "authz", label: "Authorization", icon: "◈" },
  { id: "access", label: "Media Access", icon: "✓" },
];

// Dot grid pattern for background
function GridPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="#f59e0b" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

function StepNode({
  step,
  index,
  activeIndex,
  isHovered,
  completed,
}: {
  step: (typeof STEPS)[0];
  index: number;
  activeIndex: number;
  isHovered: boolean;
  completed: boolean;
}) {
  const isActive = index === activeIndex;

  return (
    <div className="flex items-center gap-3 relative z-10">
      {/* Icon */}
      <motion.div
        animate={{
          boxShadow: isActive
            ? `0 0 ${isHovered ? 24 : 16}px ${isHovered ? 8 : 5}px rgba(245,158,11,${isHovered ? 0.6 : 0.45})`
            : completed
              ? "0 0 6px 2px rgba(52,211,153,0.2)"
              : "none",
          borderColor: isActive
            ? "rgba(245,158,11,0.85)"
            : completed
              ? "rgba(52,211,153,0.55)"
              : "rgba(245,158,11,0.12)",
          scale: isActive ? (isHovered ? 1.12 : 1.06) : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-10 h-10 rounded-2xl border flex items-center justify-center text-sm shrink-0"
        style={{
          background: isActive
            ? "rgba(245,158,11,0.12)"
            : completed
              ? "rgba(52,211,153,0.08)"
              : "rgba(245,158,11,0.04)",
          borderColor: "rgba(245,158,11,0.12)",
        }}
      >
        {completed ? (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-emerald-400 text-sm"
          >
            ✓
          </motion.span>
        ) : (
          <span
            style={{
              color: isActive ? "#f59e0b" : "rgba(245,158,11,0.25)",
              transition: "color 0.3s",
            }}
          >
            {step.icon}
          </span>
        )}
      </motion.div>

      {/* Label */}
      <motion.div
        animate={{
          opacity: isActive || completed ? 1 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="text-xs font-medium"
          style={{
            color: isActive
              ? "#f59e0b"
              : completed
                ? "rgba(52,211,153,0.8)"
                : "rgba(245,158,11,0.3)",
            transition: "color 0.3s",
          }}
        >
          {step.label}
        </div>
        {completed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-[10px] font-mono text-emerald-500/60"
          >
            Verified
          </motion.div>
        )}
      </motion.div>

      {/* Active pulse dot */}
      {isActive && (
        <motion.div
          className="ml-auto w-2 h-2 rounded-full bg-amber-400"
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      )}
    </div>
  );
}

function ConnectorSegment({
  active,
  completed,
}: {
  active: boolean;
  completed: boolean;
}) {
  return (
    <div
      className="ml-5 w-0.5 h-5 rounded-full"
      style={{
        background: completed
          ? "rgba(52,211,153,0.35)"
          : active
            ? "rgba(245,158,11,0.45)"
            : "rgba(245,158,11,0.08)",
        transition: "background 0.4s",
      }}
    />
  );
}

export function AccessVerificationCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set());
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function tick() {
      setActiveIndex((prev) => {
        const next = (prev + 1) % STEPS.length;
        if (next === 0) {
          // Reset on loop
          setCompletedSet(new Set());
        } else {
          setCompletedSet((c) => new Set([...c, prev]));
        }
        return next;
      });
    }

    timerRef.current = setInterval(tick, 1200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="relative w-full rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#0c0700] via-[#100900] to-[#0a0600] overflow-hidden p-6 flex flex-col md:flex-row gap-6"
      style={{
        boxShadow: isHovered
          ? "0 0 40px 4px rgba(245,158,11,0.11), inset 0 1px 0 rgba(245,158,11,0.08)"
          : "0 0 0 1px rgba(245,158,11,0.06), inset 0 1px 0 rgba(245,158,11,0.04)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      <GridPattern />

      {/* Ambient radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 80% at 20% 50%, rgba(245,158,11,0.06) 0%, transparent 65%)",
        }}
      />

      {/* Left: header */}
      <div className="relative z-10 md:w-64 shrink-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
          <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest">
            Access Control
          </span>
        </div>
        <h3 className="text-lg font-semibold text-amber-100/90 leading-tight mb-2">
          Access Verification
        </h3>
        <p className="text-xs text-amber-100/35 leading-relaxed">
          Every access request is authenticated and authorized before media is
          served.
        </p>

        {/* Status */}
        <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-500/10 bg-amber-500/5 w-fit">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"
          />
          <span className="text-[10px] font-mono text-amber-400/70">
            Real-time verification
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px self-stretch bg-amber-500/10" />

      {/* Right: step flow */}
      <div className="relative z-10 flex-1 flex flex-col justify-center gap-0">
        {STEPS.map((step, i) => (
          <div key={step.id}>
            <StepNode
              step={step}
              index={i}
              activeIndex={activeIndex}
              isHovered={isHovered}
              completed={completedSet.has(i)}
            />
            {i < STEPS.length - 1 && (
              <ConnectorSegment
                active={activeIndex > i}
                completed={completedSet.has(i)}
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
