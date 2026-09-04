"use client";

import React from "react";
import { motion } from "framer-motion";
import { MediaPipelineCard } from "./cards/media-pipeline-card";
import { SecurityActivityCard } from "./cards/security-activity-card";
import { EncryptionEngineCard } from "./cards/encryption-engine-card";
import { SecureSharingCard } from "./cards/secure-sharing-card";
import { AccessVerificationCard } from "./cards/access-verification-card";

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)", scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.7,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  }),
};

/**
 * Layout — 12-col × 2 explicit rows, all cells perfectly flush:
 *
 * Row 1 (240px): [MediaPipeline 7col] [SecurityActivity 5col ← spans rows 1+2]
 * Row 2 (240px): [Encryption 4col]    [Sharing 3col]         ↑
 * Row 3 (auto) : [AccessVerification  ←  full 12col  →            ]
 *
 * Gap = 16px everywhere for a slightly more breathable bento feel.
 */
const ROW_1 = 250; // px
const ROW_2 = 250; // px
const GAP = 16; // px

export function BentoGrid() {
  return (
    <section id="features" className="relative w-full py-24 px-4 md:px-8 overflow-hidden bg-background">
      {/* ── Background Effects ── */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)",
        }}
      />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest">
              Platform Capabilities
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4">
            Every file. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">Protected end to end.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Upload, encrypt, store, share and verify access — enterprise-grade
            media security handled seamlessly at scale.
          </p>
        </motion.div>

        {/* ── DESKTOP GRID (md+) ── */}
        <div
          className="hidden md:grid"
          style={{
            gap: GAP,
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: `${ROW_1}px ${ROW_2}px auto`,
          }}
        >
          {/* Card 1 — Media Pipeline: cols 1-7, row 1 */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            style={{ gridColumn: "1 / 8", gridRow: "1" }}
          >
            <div className="h-full">
              <MediaPipelineCard />
            </div>
          </motion.div>

          {/* Card 2 — Security Activity: cols 8-12, rows 1+2 (exact height = ROW_1 + GAP + ROW_2) */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            style={{ gridColumn: "8 / 13", gridRow: "1 / 3" }}
          >
            <div style={{ height: ROW_1 + GAP + ROW_2 }}>
              <SecurityActivityCard />
            </div>
          </motion.div>

          {/* Card 3 — Encryption Engine: cols 1-5, row 2 */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            style={{ gridColumn: "1 / 5", gridRow: "2" }}
          >
            <div className="h-full">
              <EncryptionEngineCard />
            </div>
          </motion.div>

          {/* Card 4 — Secure Sharing: cols 5-8, row 2 */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            style={{ gridColumn: "5 / 8", gridRow: "2" }}
          >
            <div className="h-full">
              <SecureSharingCard />
            </div>
          </motion.div>

          {/* Card 5 — Access Verification: full width, row 3 */}
          <motion.div
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            style={{ gridColumn: "1 / 13", gridRow: "3" }}
          >
            <AccessVerificationCard />
          </motion.div>
        </div>

        {/* ── MOBILE STACK ── */}
        <div className="flex flex-col gap-4 md:hidden">
          {(
            [
              MediaPipelineCard,
              SecurityActivityCard,
              EncryptionEngineCard,
              SecureSharingCard,
              AccessVerificationCard,
            ] as React.ComponentType[]
          ).map((Card, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              style={{ minHeight: 250 }}
            >
              <Card />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
