"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className = "", fill = "white" }: SpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!divRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMounted, mouseX, mouseY]);

  return (
    <motion.div
      ref={divRef}
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(245, 158, 11, 0.08), transparent 40%)`,
        }}
      />
      <svg
        className="absolute h-[150%] w-[150%] animate-spotlight opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <ellipse
          cx="50%"
          cy="50%"
          rx="25%"
          ry="35%"
          fill={`url(#spotlight-gradient-${fill})`}
        />
        <defs>
          <radialGradient id={`spotlight-gradient-${fill}`}>
            <stop offset="0%" stopColor={fill} stopOpacity="0.15" />
            <stop offset="100%" stopColor={fill} stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

export function MovingBorder({
  children,
  duration = 4000,
  className = "",
  containerClassName = "",
  borderClassName = "",
  as: Component = "div",
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: React.ElementType;
}) {
  return (
    <Component
      className={`relative p-[1px] overflow-hidden ${containerClassName}`}
    >
      <div
        className={`absolute inset-0 ${borderClassName}`}
        style={{
          background: `linear-gradient(var(--border-angle, 0deg), transparent 40%, rgba(245, 158, 11, 0.6) 50%, transparent 60%)`,
          animation: `border-rotate ${duration}ms linear infinite`,
        }}
      />
      <div className={`relative bg-background ${className}`}>{children}</div>
    </Component>
  );
}

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowingCard({
  children,
  className = "",
  glowColor = "amber",
}: GlowingCardProps) {
  const colors = {
    amber: "rgba(245, 158, 11, 0.15)",
    purple: "rgba(168, 85, 247, 0.15)",
    blue: "rgba(59, 130, 246, 0.15)",
  };

  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
        style={{
          background: colors[glowColor as keyof typeof colors] || colors.amber,
        }}
      />
      <div className="relative glass-card rounded-xl">{children}</div>
    </motion.div>
  );
}

export function BackgroundLines({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg
        className="absolute w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(245, 158, 11, 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {[...Array(5)].map((_, i) => (
          <motion.line
            key={i}
            x1="0"
            y1={`${20 + i * 15}%`}
            x2="100%"
            y2={`${20 + i * 15}%`}
            stroke="url(#line-gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function FloatingParticles({ count = 20 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-500/30"
          initial={{
            x: Math.random() * 100 + "%",
            y: "100%",
            opacity: 0,
          }}
          animate={{
            y: "-20%",
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
