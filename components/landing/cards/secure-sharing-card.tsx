"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";

const STATUS_LABELS = ["Encrypted", "Shared", "Verified"] as const;

function Particle({
  progress,
  isHovered,
}: {
  progress: number;
  isHovered: boolean;
}) {
  const x = `${progress * 100}%`;
  const opacity =
    progress < 0.1 ? progress / 0.1 : progress > 0.9 ? (1 - progress) / 0.1 : 1;

  return (
    <div
      className="absolute w-1.5 h-1.5 rounded-full"
      style={{
        left: x,
        top: "50%",
        transform: "translate(-50%, -50%)",
        background: "#fbbf24",
        opacity,
        boxShadow: `0 0 ${isHovered ? 10 : 6}px 3px rgba(251,191,36,0.7)`,
      }}
    />
  );
}

export function SecureSharingCard() {
  const [particles, setParticles] = useState([0.0, 0.33, 0.66]);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const speed = isHovered ? 0.006 : 0.004;

  useAnimationFrame(() => {
    setParticles((prev) => prev.map((p) => (p + speed) % 1));
  });

  useEffect(() => {
    const interval = setInterval(
      () => setStatusIndex((i) => (i + 1) % STATUS_LABELS.length),
      1400,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="relative h-full rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#0c0700] via-[#100900] to-[#0a0600] overflow-hidden p-5 flex flex-col"
      style={{
        boxShadow: isHovered
          ? "0 0 36px 4px rgba(245,158,11,0.11), inset 0 1px 0 rgba(245,158,11,0.08)"
          : "0 0 0 1px rgba(245,158,11,0.06), inset 0 1px 0 rgba(245,158,11,0.04)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      {/* Ambient bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 50% 50%, rgba(245,158,11,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
          <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest">
            Secure Sharing
          </span>
        </div>
        <h3 className="text-base font-semibold text-amber-100/90">
          Encrypted File Transfer
        </h3>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-5">
        {/* Owner node */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center border border-amber-500/25"
            style={{ background: "rgba(245,158,11,0.08)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="rgba(245,158,11,0.8)"
                strokeWidth="1.5"
              />
              <path
                d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                stroke="rgba(245,158,11,0.8)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[10px] font-mono text-amber-400/70">Owner</span>
        </div>

        {/* Beam connection */}
        <div className="w-full flex flex-col items-center gap-1.5">
          <div
            className="relative w-full h-4 flex items-center rounded-full overflow-hidden"
            style={{ background: "rgba(245,158,11,0.04)", height: 4 }}
          >
            {/* Track */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: isHovered
                  ? "linear-gradient(to right, rgba(245,158,11,0.18), rgba(245,158,11,0.30), rgba(245,158,11,0.18))"
                  : "linear-gradient(to right, rgba(245,158,11,0.08), rgba(245,158,11,0.15), rgba(245,158,11,0.08))",
                transition: "background 0.4s",
              }}
            />
            {/* Particles */}
            {particles.map((p, i) => (
              <Particle key={i} progress={p} isHovered={isHovered} />
            ))}
          </div>

          {/* Status label */}
          <div className="flex items-center gap-1.5">
            <motion.span
              key={statusIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] font-mono text-amber-400/80 px-2 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/8"
            >
              {STATUS_LABELS[statusIndex]}
            </motion.span>
          </div>
        </div>

        {/* Recipient node */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center border border-amber-500/25"
            style={{ background: "rgba(245,158,11,0.08)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="rgba(245,158,11,0.55)"
                strokeWidth="1.5"
              />
              <path
                d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                stroke="rgba(245,158,11,0.55)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[10px] font-mono text-amber-400/50">
            Recipient
          </span>
        </div>
      </div>

      {/* Footer badge */}
      <div className="relative z-10 mt-3 flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/10 bg-amber-500/5">
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"
        />
        <span className="text-[10px] font-mono text-amber-400/60">
          Zero-knowledge encrypted transfer
        </span>
      </div>
    </motion.div>
  );
}
