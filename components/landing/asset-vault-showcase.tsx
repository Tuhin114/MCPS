"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";

// ─── Asset Definitions ───────────────────────────────────────────────────────

const ASSETS = [
  {
    id: "pdf",
    label: "Report.pdf",
    ext: "PDF",
    size: "12.4 MB",
    color: "#ef4444",
    bgColor: "rgba(239,68,68,0.12)",
    borderColor: "rgba(239,68,68,0.25)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="14 2 14 8 20 8" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="9" y1="13" x2="15" y2="13" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="9" y1="17" x2="13" y2="17" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "image",
    label: "Banner.png",
    ext: "PNG",
    size: "8.1 MB",
    color: "#3b82f6",
    bgColor: "rgba(59,130,246,0.12)",
    borderColor: "rgba(59,130,246,0.25)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#3b82f6" strokeWidth="1.5"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="#3b82f6"/>
        <polyline points="21 15 16 10 5 21" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "video",
    label: "Keynote.mp4",
    ext: "MP4",
    size: "1.2 GB",
    color: "#a855f7",
    bgColor: "rgba(168,85,247,0.12)",
    borderColor: "rgba(168,85,247,0.25)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <polygon points="23 7 16 12 23 17 23 7" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="1" y="5" width="15" height="14" rx="2" stroke="#a855f7" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "doc",
    label: "Contract.docx",
    ext: "DOCX",
    size: "3.2 MB",
    color: "#22c55e",
    bgColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.25)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="14 2 14 8 20 8" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="9" y1="13" x2="15" y2="13" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="9" y1="17" x2="15" y2="17" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "audio",
    label: "Podcast.mp3",
    ext: "MP3",
    size: "94 MB",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.12)",
    borderColor: "rgba(245,158,11,0.25)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M9 18V5l12-2v13" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="6" cy="18" r="3" stroke="#f59e0b" strokeWidth="1.5"/>
        <circle cx="18" cy="16" r="3" stroke="#f59e0b" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

// ─── Encryption sequence states ───────────────────────────────────────────────
type Phase = "idle" | "scanning" | "encrypting" | "locked";

const PHASE_LABELS: Record<Phase, string> = {
  idle: "Awaiting upload...",
  scanning: "Scanning file...",
  encrypting: "AES-256-CBC encrypting...",
  locked: "Secured & locked ✓",
};

const PHASE_COLORS: Record<Phase, string> = {
  idle: "rgba(148,163,184,0.7)",
  scanning: "rgba(59,130,246,0.9)",
  encrypting: "rgba(245,158,11,0.9)",
  locked: "rgba(34,197,94,0.9)",
};

// ─── Scramble text hook ────────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

function useScramble(target: string, active: boolean) {
  const [display, setDisplay] = useState(target);
  const frame = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) { setDisplay(target); return; }
    frame.current = 0;
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      frame.current++;
      const progress = Math.min(frame.current / 16, 1);
      setDisplay(
        target.split("").map((ch, i) => {
          if (ch === " " || ch === ".") return ch;
          if (i / target.length < progress) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      if (progress >= 1 && timer.current) clearInterval(timer.current);
    }, 45);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [target, active]);

  return display;
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ phase }: { phase: Phase }) {
  const progress = { idle: 0, scanning: 33, encrypting: 66, locked: 100 }[phase];
  return (
    <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{
          background: phase === "locked"
            ? "linear-gradient(90deg, #22c55e, #16a34a)"
            : phase === "encrypting"
            ? "linear-gradient(90deg, #f59e0b, #d97706)"
            : "linear-gradient(90deg, #3b82f6, #2563eb)",
        }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─── Lock SVG (animates open → closed) ────────────────────────────────────────
function AnimatedLock({ locked }: { locked: boolean }) {
  return (
    <motion.svg
      width="48" height="48" viewBox="0 0 24 24" fill="none"
      animate={{ scale: locked ? [1, 1.15, 1] : 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.rect
        x="5" y="11" width="14" height="10" rx="2"
        fill="rgba(245,158,11,0.15)"
        stroke="rgba(245,158,11,0.9)"
        strokeWidth="1.5"
      />
      <motion.path
        stroke="rgba(245,158,11,0.9)"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ d: locked ? "M8 11V7a4 4 0 0 1 8 0v4" : "M8 11V8a4 4 0 0 1 7.4-2" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      />
      <motion.circle
        cx="12" cy="16" r="1.5"
        fill="rgba(245,158,11,0.9)"
        animate={{ opacity: locked ? 1 : 0.3 }}
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  );
}

// ─── Single asset card ────────────────────────────────────────────────────────
function AssetCard({
  asset,
  isActive,
  phase,
  delay,
}: {
  asset: (typeof ASSETS)[0];
  isActive: boolean;
  phase: Phase;
  delay: number;
}) {
  const scrambled = useScramble(asset.label, isActive && phase === "encrypting");
  const isLocked = isActive && phase === "locked";

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      className="relative flex items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-sm transition-all duration-500"
      style={{
        borderColor: isActive ? asset.borderColor : "rgba(255,255,255,0.06)",
        background: isActive ? asset.bgColor : "rgba(255,255,255,0.03)",
        boxShadow: isLocked
          ? `0 0 20px 2px ${asset.color}22`
          : isActive
          ? `0 0 12px 1px ${asset.color}15`
          : "none",
      }}
    >
      {/* File icon */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ background: asset.bgColor, border: `1px solid ${asset.borderColor}` }}
      >
        {asset.icon}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium font-mono truncate transition-colors duration-300"
          style={{ color: isActive ? asset.color : "rgba(255,255,255,0.6)" }}
        >
          {scrambled}
        </p>
        <p className="text-xs text-white/30 mt-0.5">
          {asset.ext} · {asset.size}
        </p>
      </div>

      {/* Status badge */}
      <AnimatePresence mode="wait">
        {isLocked ? (
          <motion.div
            key="locked"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
            style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}
          >
            <svg width="8" height="8" viewBox="0 0 10 10" fill="#22c55e">
              <circle cx="5" cy="5" r="5" />
            </svg>
            SECURED
          </motion.div>
        ) : isActive ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-1"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: asset.color }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-2 w-2 rounded-full bg-white/15"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Orbiting encryption ring ─────────────────────────────────────────────────
function EncryptionRing({ active }: { active: boolean }) {
  const [angle, setAngle] = useState(0);
  useAnimationFrame(() => {
    setAngle((a) => (a + (active ? 0.8 : 0.25)) % 360);
  });

  const TAGS = ["AES-256", "CBC", "DEK", "IV", "WRAP"];
  const radius = 52;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      {/* Outer dashed ring */}
      <div
        className="absolute rounded-full border border-dashed"
        style={{
          width: 140, height: 140,
          borderColor: active ? "rgba(245,158,11,0.3)" : "rgba(245,158,11,0.1)",
          transition: "border-color 0.4s",
        }}
      />
      {/* Inner ring */}
      <div
        className="absolute rounded-full border"
        style={{
          width: 100, height: 100,
          borderColor: active ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.06)",
          transition: "border-color 0.4s",
        }}
      />

      {/* Orbiting tags */}
      {TAGS.map((tag, i) => {
        const a = ((angle + (i * 360) / TAGS.length) * Math.PI) / 180;
        const x = Math.cos(a) * radius;
        const y = Math.sin(a) * radius;
        return (
          <div
            key={tag}
            className="absolute text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              color: "rgba(245,158,11,0.8)",
              borderColor: "rgba(245,158,11,0.2)",
              background: "rgba(245,158,11,0.06)",
              backdropFilter: "blur(4px)",
              opacity: active ? 0.9 : 0.4,
              transition: "opacity 0.4s",
            }}
          >
            {tag}
          </div>
        );
      })}

      {/* Center lock */}
      <div className="relative z-10">
        <motion.div
          animate={{
            boxShadow: active
              ? "0 0 32px 8px rgba(245,158,11,0.35), 0 0 0 1px rgba(245,158,11,0.3)"
              : "0 0 16px 4px rgba(245,158,11,0.12), 0 0 0 1px rgba(245,158,11,0.1)",
          }}
          transition={{ duration: 0.5 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.18) 0%, rgba(10,6,0,0.9) 70%)" }}
        >
          <AnimatedLock locked={active} />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Data stream particles between asset list and lock ────────────────────────
function DataStream({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px rounded-full"
          style={{
            top: `${15 + i * 10}%`,
            left: "30%",
            width: "40%",
            background: `linear-gradient(90deg, transparent, rgba(245,158,11,${0.3 + Math.random() * 0.4}), transparent)`,
          }}
          initial={{ scaleX: 0, opacity: 0, x: "-100%" }}
          animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0], x: ["0%", "100%"] }}
          transition={{
            duration: 1.2,
            delay: i * 0.15,
            repeat: Infinity,
            repeatDelay: 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AssetVaultShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set());
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runCycle = (idx: number) => {
    const asset = ASSETS[idx];
    setActiveIdx(idx);
    setPhase("scanning");

    cycleRef.current = setTimeout(() => setPhase("encrypting"), 900);
    cycleRef.current = setTimeout(() => {
      setPhase("locked");
      setLockedIds((prev) => new Set([...prev, asset.id]));
    }, 1900);
    cycleRef.current = setTimeout(() => {
      const next = (idx + 1) % ASSETS.length;
      if (next === 0) setLockedIds(new Set()); // reset on full cycle
      runCycle(next);
    }, 3200);
  };

  useEffect(() => {
    const timer = setTimeout(() => runCycle(0), 600);
    return () => {
      clearTimeout(timer);
      if (cycleRef.current) clearTimeout(cycleRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isEncrypting = phase === "encrypting" || phase === "scanning";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
      className="relative mt-16 mx-auto max-w-3xl"
    >
      {/* Outer glow */}
      <div
        className="absolute -inset-px rounded-3xl pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.15), transparent 40%, rgba(168,85,247,0.08))",
        }}
      />

      {/* Main card */}
      <div
        className="relative rounded-3xl border border-white/8 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(12,7,0,0.95) 0%, rgba(8,6,12,0.95) 100%)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[11px] font-mono text-white/30 ml-1">MCPS Vault Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1"
              animate={{
                borderColor: isEncrypting ? "rgba(245,158,11,0.4)" : "rgba(34,197,94,0.35)",
                background: isEncrypting ? "rgba(245,158,11,0.08)" : "rgba(34,197,94,0.08)",
              }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="h-1.5 w-1.5 rounded-full"
                animate={{
                  backgroundColor: isEncrypting ? "#f59e0b" : "#22c55e",
                  boxShadow: isEncrypting
                    ? "0 0 6px 2px rgba(245,158,11,0.6)"
                    : "0 0 6px 2px rgba(34,197,94,0.6)",
                }}
                transition={{ duration: 0.4 }}
              />
              <motion.span
                className="text-[10px] font-mono font-semibold"
                animate={{ color: isEncrypting ? "#f59e0b" : "#22c55e" }}
                transition={{ duration: 0.4 }}
              >
                {isEncrypting ? "ENCRYPTING" : "SECURED"}
              </motion.span>
            </motion.div>
          </div>
        </div>

        {/* Body */}
        <div className="relative flex items-center gap-0 p-5">
          <DataStream active={isEncrypting} />

          {/* Left — Asset list */}
          <div className="flex-1 flex flex-col gap-2.5 pr-6">
            {/* Section label */}
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/25">
                Digital Assets
              </span>
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-mono text-white/20">
                {lockedIds.size}/{ASSETS.length} secured
              </span>
            </div>

            {ASSETS.map((asset, i) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                isActive={i === activeIdx}
                phase={lockedIds.has(asset.id) && i !== activeIdx ? "locked" : i === activeIdx ? phase : "idle"}
                delay={i * 0.06}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="h-64 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent mx-2 shrink-0" />

          {/* Right — Encryption engine */}
          <div className="flex w-40 shrink-0 flex-col items-center gap-4 pl-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/25">
              Encryption
            </span>
            <EncryptionRing active={isEncrypting} />

            {/* Phase status */}
            <div className="w-full space-y-2">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phase}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-center text-[10px] font-mono font-medium"
                  style={{ color: PHASE_COLORS[phase] }}
                >
                  {PHASE_LABELS[phase]}
                </motion.p>
              </AnimatePresence>
              <ProgressBar phase={phase} />
            </div>

            {/* Stats */}
            <div className="w-full space-y-1.5">
              {[
                { label: "Algorithm", value: "AES-256-CBC" },
                { label: "Key size", value: "256-bit DEK" },
                { label: "IV length", value: "128-bit" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-white/25">{label}</span>
                  <span className="text-[9px] font-mono text-amber-400/60">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div className="flex items-center justify-between border-t border-white/5 px-5 py-2.5">
          <div className="flex items-center gap-4">
            {["Watermark", "Encrypt", "Audit Log"].map((feat) => (
              <span key={feat} className="flex items-center gap-1.5 text-[10px] text-white/30">
                <span className="h-1 w-1 rounded-full bg-amber-500/60" />
                {feat}
              </span>
            ))}
          </div>
          <span className="text-[10px] font-mono text-white/20">
            Zero-exposure storage
          </span>
        </div>
      </div>
    </motion.div>
  );
}
