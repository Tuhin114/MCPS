"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";

const ORBIT_LABELS = [
  { label: "AES-256", angle: 0 },
  { label: "KEY", angle: 90 },
  { label: "IV", angle: 180 },
  { label: "HASH", angle: 270 },
];

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

function useScrambleText(target: string, active: boolean) {
  const [display, setDisplay] = useState(target);
  const frameRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      setDisplay(target);
      return;
    }
    frameRef.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      frameRef.current++;
      const progress = Math.min(frameRef.current / 18, 1);
      setDisplay(
        target
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i / target.length < progress) return char;
            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
          })
          .join(""),
      );
      if (progress >= 1 && intervalRef.current)
        clearInterval(intervalRef.current);
    }, 40);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [target, active]);

  return display;
}

function OrbitLabel({
  label,
  baseAngle,
  rotation,
  isHovered,
}: {
  label: string;
  baseAngle: number;
  rotation: number;
  isHovered: boolean;
}) {
  const angle = ((baseAngle + rotation) * Math.PI) / 180;
  const radius = 72;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
      animate={{
        opacity: isHovered ? 1 : 0.7,
      }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="px-2 py-0.5 rounded-lg border border-amber-500/25 bg-amber-500/8 text-[10px] font-mono font-semibold text-amber-400/80 whitespace-nowrap select-none"
        style={{
          backdropFilter: "blur(4px)",
          boxShadow: isHovered ? "0 0 8px 1px rgba(245,158,11,0.15)" : "none",
          transition: "box-shadow 0.3s",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

export function EncryptionEngineCard() {
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const speedRef = useRef(0.15);

  useAnimationFrame(() => {
    speedRef.current = isHovered ? 0.3 : 0.15;
    setRotation((r) => (r + speedRef.current) % 360);
  });

  const plainText = useScrambleText("Plain File", isHovered);
  const encText = useScrambleText("Encrypted File", isHovered);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.025 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="relative h-full rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#0c0700] via-[#100900] to-[#0a0600] overflow-hidden p-5 flex flex-col"
      style={{
        boxShadow: isHovered
          ? "0 0 40px 6px rgba(245,158,11,0.12), inset 0 1px 0 rgba(245,158,11,0.08)"
          : "0 0 0 1px rgba(245,158,11,0.06), inset 0 1px 0 rgba(245,158,11,0.04)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      {/* Radial background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 60%, rgba(245,158,11,0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
          <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest">
            Encryption Engine
          </span>
        </div>
        <h3 className="text-base font-semibold text-amber-100/90">
          Military-Grade Encryption
        </h3>
      </div>

      {/* Orbit scene */}
      <div
        className="flex-1 flex items-center justify-center relative"
        style={{ minHeight: 180 }}
      >
        {/* Orbit ring */}
        <div
          className="absolute w-36 h-36 rounded-full border border-dashed border-amber-500/12"
          style={{ borderRadius: "50%" }}
        />

        {/* Orbiting labels */}
        {ORBIT_LABELS.map((item) => (
          <OrbitLabel
            key={item.label}
            label={item.label}
            baseAngle={item.angle}
            rotation={rotation}
            isHovered={isHovered}
          />
        ))}

        {/* Lock icon */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center"
          animate={{
            scale: isHovered ? 1.08 : 1,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
            style={{
              background:
                "radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(10,6,0,0.8) 70%)",
              boxShadow: isHovered
                ? "0 0 32px 10px rgba(245,158,11,0.3), 0 0 0 1px rgba(245,158,11,0.25)"
                : "0 0 16px 4px rgba(245,158,11,0.15), 0 0 0 1px rgba(245,158,11,0.12)",
              transition: "box-shadow 0.4s ease",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect
                x="5"
                y="11"
                width="14"
                height="10"
                rx="2"
                fill="rgba(245,158,11,0.2)"
                stroke="rgba(245,158,11,0.8)"
                strokeWidth="1.5"
              />
              <path
                d="M8 11V7a4 4 0 0 1 8 0v4"
                stroke="rgba(245,158,11,0.8)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16" r="1.5" fill="rgba(245,158,11,0.9)" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Scramble label */}
      <div className="relative z-10 mt-3 flex items-center justify-center gap-2 text-[11px] font-mono">
        <span className="text-amber-500/50">
          {isHovered ? encText : plainText}
        </span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-amber-500/40"
        >
          →
        </motion.span>
        <span className="text-amber-400/80">
          {isHovered ? "Protected" : "Encrypting"}
        </span>
      </div>

      {/* Bottom badge */}
      <div className="relative z-10 mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/10 bg-amber-500/5 w-fit mx-auto">
        <span className="text-[10px] font-mono text-amber-400/60">
          AES-256-GCM
        </span>
        <span className="text-amber-900/50">·</span>
        <span className="text-[10px] font-mono text-amber-400/60">
          FIPS 140-2
        </span>
      </div>
    </motion.div>
  );
}
