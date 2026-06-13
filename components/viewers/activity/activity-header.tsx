"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, ChevronDown, Calendar } from "lucide-react";

const ranges = ["Today", "Last 7 Days", "Last 30 Days", "Last 90 Days"];

export function ActivityHeader() {
  const [range, setRange] = useState("Last 30 Days");
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
          Activity &amp; Analytics
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          Monitor content protection, sharing activity, downloads and security events.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-300 backdrop-blur-xl transition-colors hover:border-zinc-700 hover:bg-zinc-800/60"
          >
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            {range}
            <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
          </button>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-20 mt-1.5 w-40 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl shadow-xl"
            >
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRange(r);
                    setOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-800/60 ${
                    r === range ? "text-amber-400" : "text-zinc-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-amber-400">
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>
    </motion.div>
  );
}
