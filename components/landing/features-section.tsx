"use client";

import { motion } from "framer-motion";
import {
  Lock,
  Droplets,
  Activity,
  Users,
  BarChart3,
  Cloud,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Cloud,
    title: "Secure Upload",
    description:
      "Drag and drop your files with instant encryption. Every upload is protected from the moment it leaves your device.",
    gradient: "from-amber-500/20 to-orange-500/20",
    size: "large",
  },
  {
    icon: Lock,
    title: "AES-256 Encryption",
    description:
      "Military-grade encryption protects your content at rest and in transit.",
    gradient: "from-purple-500/20 to-violet-500/20",
    size: "small",
  },
  {
    icon: Droplets,
    title: "Smart Watermarking",
    description:
      "Invisible or visible watermarks that survive compression and editing.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    size: "small",
  },
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description:
      "Track file access, downloads, and sharing activity with detailed analytics and instant notifications.",
    gradient: "from-green-500/20 to-emerald-500/20",
    size: "medium",
  },
  {
    icon: Users,
    title: "Access Control",
    description:
      "Granular permissions for teams, clients, and collaborators with time-based access.",
    gradient: "from-pink-500/20 to-rose-500/20",
    size: "medium",
  },
  {
    icon: BarChart3,
    title: "Storage Analytics",
    description:
      "Comprehensive insights into your storage usage, file types, and optimization opportunities.",
    gradient: "from-amber-500/20 to-yellow-500/20",
    size: "large",
  },
];

function BentoCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`group relative rounded-3xl overflow-hidden ${
        feature.size === "large"
          ? "md:col-span-2 md:row-span-2"
          : feature.size === "medium"
            ? "md:col-span-1 md:row-span-2"
            : "md:col-span-1 md:row-span-1"
      }`}
    >
      {/* Animated border */}
      <div className="absolute inset-0 rounded-3xl p-px overflow-hidden bg-white/5 group-hover:bg-transparent transition-colors">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `linear-gradient(var(--border-angle, 0deg), transparent 40%, rgba(245, 158, 11, 0.7) 50%, transparent 60%)`,
            animation: "border-rotate 4s linear infinite",
          }}
        />
      </div>

      {/* Card content */}
      <div className="relative h-full p-8 rounded-3xl bg-black/60 border border-transparent backdrop-blur-xl transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {/* Gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none`}
        />

        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300 shadow-lg shadow-amber-500/10">
            <Icon className="w-7 h-7 text-amber-500" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-amber-400 transition-colors duration-300">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-sm font-medium text-muted-foreground leading-relaxed flex-1">
            {feature.description}
          </p>

          {/* Dashboard preview for large cards */}
          {feature.size === "large" && (
            <div className="mt-8 rounded-xl bg-white/5 border border-white/10 p-5 opacity-60 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Live Preview
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 rounded-lg bg-white/10 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '7s' }} />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-semibold mb-6 backdrop-blur-md">
            <Zap className="w-4 h-4" />
            Powerful Features
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
            Everything You Need to{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700">
              Protect Your Content
            </span>
          </h2>
          <p className="text-lg md:text-xl font-medium text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A comprehensive suite of tools designed for creators, agencies, and
            enterprises who take content security seriously.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 auto-rows-fr">
          {features.map((feature, index) => (
            <BentoCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
