"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Play, Shield, Lock, Cloud, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

import dynamic from "next/dynamic";

const FloatingParticles = dynamic(
  () =>
    import("@/components/ui/aceternity-effects").then(
      (mod) => mod.FloatingParticles,
    ),
  { ssr: false },
);

function AnimatedCounter({
  value,
  suffix = "",
  duration = 2,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 10, suffix: "M+", label: "Protected Files", icon: Shield },
  { value: 99.9, suffix: "%", label: "Secure Delivery", icon: Lock },
  { value: 250, suffix: "K+", label: "Active Users", icon: Users },
  { value: 45, suffix: "TB", label: "Protected Media", icon: Cloud },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      {/* Spotlight effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] animate-glow-pulse" />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[100px] animate-glow-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Floating particles */}
      <FloatingParticles count={30} />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-sm font-medium text-amber-500">
              Enterprise-grade Security
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="text-foreground">Protect Your </span>
            <span className="gradient-text">Digital Assets</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Encrypt, watermark, manage, and securely share your multimedia
            content from one unified platform. Built for creators, trusted by
            enterprises.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 h-12 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border/50 bg-white/5 hover:bg-white/10 h-12 px-8 group"
            >
              <Play className="mr-2 h-4 w-4 text-amber-500" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="group relative p-6 rounded-xl glass-card hover-glow-border cursor-default"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="h-5 w-5 text-amber-500" />
                  <span className="text-3xl md:text-4xl font-bold text-foreground">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating Dashboard Cards */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none h-32 bottom-0 top-auto" />

          <div className="relative max-w-6xl mx-auto">
            {/* Main dashboard preview */}
            <div className="relative rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden shadow-2xl">
              {/* Window controls */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-card/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground">
                    app.mcps.io/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-6 bg-gradient-to-br from-card/50 to-card/30">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Total Files", value: "12,847", change: "+12%" },
                    { label: "Storage Used", value: "847 GB", change: "68%" },
                    { label: "Active Shares", value: "1,234", change: "+8%" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="p-4 rounded-lg bg-muted/30 border border-border/30"
                    >
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.label}
                      </p>
                      <p className="text-xl font-semibold text-foreground">
                        {item.value}
                      </p>
                      <p className="text-xs text-amber-500">{item.change}</p>
                    </motion.div>
                  ))}
                </div>

                {/* File list preview */}
                <div className="rounded-lg bg-muted/20 border border-border/30 overflow-hidden">
                  <div className="px-4 py-2 border-b border-border/30 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Recent Files
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Last 24 hours
                    </span>
                  </div>
                  {[
                    {
                      name: "product_launch.mp4",
                      size: "2.4 GB",
                      status: "Encrypted",
                    },
                    {
                      name: "brand_assets.zip",
                      size: "156 MB",
                      status: "Protected",
                    },
                    {
                      name: "client_review.pdf",
                      size: "12 MB",
                      status: "Shared",
                    },
                  ].map((file, i) => (
                    <motion.div
                      key={file.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="px-4 py-3 flex items-center justify-between border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm text-foreground">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.size}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        {file.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating side cards */}
            <motion.div
              className="absolute -left-28 top-1/3 p-4 rounded-xl glass-card border border-border/30 shadow-xl hidden lg:block"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">AES-256</p>
                  <p className="text-xs text-muted-foreground">
                    Encryption Active
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-12 top-1/4 p-4 rounded-xl glass-card border border-border/30 shadow-xl hidden lg:block"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">99.99%</p>
                  <p className="text-xs text-muted-foreground">Uptime SLA</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-28 bottom-1/4 p-4 rounded-xl glass-card border border-border/30 shadow-xl hidden lg:block"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">250K+</p>
                  <p className="text-xs text-muted-foreground">
                    Creators Trust Us
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
