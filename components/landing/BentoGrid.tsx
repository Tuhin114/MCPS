"use client";

import React from "react";
import { motion } from "framer-motion";
import { MediaPipelineCard } from "./cards/media-pipeline-card";
import { SecurityActivityCard } from "./cards/security-activity-card";
import { EncryptionEngineCard } from "./cards/encryption-engine-card";
import { SecureSharingCard } from "./cards/secure-sharing-card";
import { AccessVerificationCard } from "./cards/access-verification-card";

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.08,
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94],
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
 * Gap = 12px everywhere. No orphan whitespace.
 */

const ROW_1 = 240; // px
const ROW_2 = 240; // px  — both rows identical so right column fills exactly
const GAP = 12; // px

export function BentoGrid() {
  return (
    <section className="relative w-full py-16 px-4 md:px-8 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            <span className="text-[11px] font-mono text-amber-400/70 uppercase tracking-widest">
              Platform Capabilities
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-amber-50/90 leading-tight mb-2">
            Every file. Protected end to end.
          </h2>
          <p className="text-sm text-amber-100/40 max-w-xl mx-auto leading-relaxed">
            Upload, encrypt, store, share and verify access — enterprise-grade
            media security at scale.
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
            viewport={{ once: true, margin: "-60px" }}
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
            viewport={{ once: true, margin: "-60px" }}
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
            viewport={{ once: true, margin: "-60px" }}
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
            viewport={{ once: true, margin: "-60px" }}
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
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            style={{ gridColumn: "1 / 13", gridRow: "3" }}
          >
            <AccessVerificationCard />
          </motion.div>
        </div>

        {/* ── MOBILE STACK ── */}
        <div className="flex flex-col gap-3 md:hidden">
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
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              style={{ minHeight: 240 }}
            >
              <Card />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
