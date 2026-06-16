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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`group relative rounded-2xl overflow-hidden ${
        feature.size === "large"
          ? "md:col-span-2 md:row-span-2"
          : feature.size === "medium"
            ? "md:col-span-1 md:row-span-2"
            : "md:col-span-1 md:row-span-1"
      }`}
    >
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl p-px overflow-hidden">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(var(--border-angle, 0deg), transparent 40%, rgba(245, 158, 11, 0.5) 50%, transparent 60%)`,
            animation: "border-rotate 3s linear infinite",
          }}
        />
      </div>

      {/* Card content */}
      <div className="relative h-full p-6 md:p-8 rounded-2xl bg-card/80 border border-border/50 backdrop-blur-sm transition-all duration-300 group-hover:border-amber-500/30 group-hover:shadow-lg group-hover:shadow-amber-500/5">
        {/* Gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
        />

        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
            <Icon className="w-6 h-6 text-amber-500" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-amber-500 transition-colors duration-300">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {feature.description}
          </p>

          {/* Dashboard preview for large cards */}
          {feature.size === "large" && (
            <div className="mt-6 rounded-lg bg-muted/30 border border-border/30 p-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">
                  Live Preview
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 rounded bg-muted/50 animate-pulse"
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
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[80px]" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Powerful Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Everything You Need to{" "}
            <span className="gradient-text-amber">Protect Your Content</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive suite of tools designed for creators, agencies, and
            enterprises who take content security seriously.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
          {features.map((feature, index) => (
            <BentoCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
