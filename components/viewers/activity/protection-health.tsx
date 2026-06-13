"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { protectionHealth } from "@/lib/activity-data";

function CircularProgress({
  value,
  size = 36,
  stroke = 4,
  color,
  delay = 0,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color: string;
  delay?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#27272a"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference - (value / 100) * circumference }}
        transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

export function ProtectionHealth() {
  const { score, breakdown } = protectionHealth;
  const size = 132;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Protection Health</CardTitle>
        <CardDescription>Overall protection posture across your library</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
          <div className="relative shrink-0">
            <svg width={size} height={size} className="-rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#27272a"
                strokeWidth={stroke}
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-semibold tracking-tight text-zinc-50 tabular-nums">{score}</span>
              <span className="text-[11px] text-zinc-500">/ 100</span>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            {breakdown.map((item, i) => (
              <div key={item.label} className="flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-800/30 p-3">
                <CircularProgress value={item.value} color={item.color} delay={0.2 + i * 0.1} />
                <div>
                  <p className="text-sm font-medium tabular-nums text-zinc-100">{item.value}%</p>
                  <p className="text-[11px] text-zinc-500">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
