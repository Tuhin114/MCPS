"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Play, Shield, Lock, Cloud, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

function AnimatedCounter({
  value,
  suffix = "",
  duration = 2.5,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16">
      {/* ── Video background ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        src="https://anfwqskgldswncpryacz.supabase.co/storage/v1/object/public/public-assets/video.mp4"
      />

      {/* ── Layered overlays on top of video ── */}
      {/* 1. Base dark wash — keeps text readable */}
      <div className="absolute inset-0 bg-background/50" />
      {/* 2. Amber radial glow — top left */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
      {/* 3. Purple glow — bottom right */}
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none"
        style={{ animationDuration: '5s', animationDelay: "2s" }}
      />
      {/* 4. Top/Bottom vignettes so video blends seamlessly into page */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      {/* 5. Subtle noise texture */}
      <div className="absolute inset-0 noise-overlay pointer-events-none opacity-60" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center mt-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-sm font-semibold tracking-wide text-amber-500">
              Enterprise-grade Security
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1]"
          >
            <span className="text-foreground drop-shadow-sm">Protect Your </span>
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 drop-shadow-sm">
              Digital Assets
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Encrypt, watermark, manage, and securely share your multimedia
            content from one unified platform. Built for creators, trusted by
            enterprises.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 h-14 text-base rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 group"
            >
              <Link href="/auth/sign-up">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/10 bg-black/20 hover:bg-white/10 backdrop-blur-md h-14 px-8 text-base font-semibold rounded-xl transition-all duration-300 group"
            >
              <Link href="#features">
                <Play className="mr-2 h-5 w-5 text-amber-500 transition-transform duration-300 group-hover:scale-110" />
                Watch Demo
              </Link>
            </Button>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="group relative p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md hover:border-amber-500/30 transition-all duration-300 cursor-default shadow-xl"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="flex flex-col items-center justify-center gap-2 mb-1">
                  <div className="p-2 rounded-lg bg-amber-500/10 mb-2 group-hover:bg-amber-500/20 transition-colors duration-300">
                    <stat.icon className="h-6 w-6 text-amber-500" />
                  </div>
                  <span className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </span>
                </div>
                <p className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>


      </div>
    </section>
  );
}

