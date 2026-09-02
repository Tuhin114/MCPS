"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";

const FloatingParticles = dynamic(
  () =>
    import("@/components/ui/aceternity-effects").then(
      (mod) => mod.FloatingParticles,
    ),
  { ssr: false },
);

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-32 bg-background">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Large ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />
      <div
        className="absolute left-1/4 top-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none"
        style={{ animationDuration: '5s', animationDelay: "1s" }}
      />
      <div
        className="absolute right-1/4 bottom-1/4 w-[250px] h-[250px] bg-amber-500/5 rounded-full blur-[80px] animate-pulse pointer-events-none"
        style={{ animationDuration: '7s', animationDelay: "2s" }}
      />

      {/* Floating particles */}
      <FloatingParticles count={40} />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-sm font-bold tracking-wide text-amber-500 uppercase">
              Start protecting your media today
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-foreground mb-6 leading-[1.1] tracking-tight"
          >
            Ready to Secure Your{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700">
              Digital Content?
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Join thousands of creators, businesses, and enterprises who trust
            MCPS to protect their valuable media assets. Get started for free.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 h-14 text-base rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 group"
            >
              <Link href="/auth/sign-up">
                <Sparkles className="mr-2 h-5 w-5" />
                Launch Dashboard
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md h-14 px-8 text-base font-semibold rounded-xl transition-all duration-300 group"
            >
              <Link href="/auth/sign-up">
                Create Free Account
              </Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              No credit card required
            </span>
            <span className="hidden sm:inline text-white/10">|</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              5 GB free storage
            </span>
            <span className="hidden sm:inline text-white/10">|</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              Cancel anytime
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
