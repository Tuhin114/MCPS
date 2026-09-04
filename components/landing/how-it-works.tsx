"use client";

import { motion } from "framer-motion";
import { Upload, Lock, Cloud, Share2, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Media",
    description:
      "Drag and drop your files or use our secure upload widget. Support for images, videos, audio, and documents.",
    color: "amber",
  },
  {
    icon: Lock,
    step: "02",
    title: "Encrypt & Protect",
    description:
      "Files are automatically encrypted with AES-256. Add optional watermarks for tracking and protection.",
    color: "amber",
  },
  {
    icon: Cloud,
    step: "03",
    title: "Secure Storage",
    description:
      "Content is stored in our distributed cloud infrastructure with multiple redundancy layers worldwide.",
    color: "amber",
  },
  {
    icon: Share2,
    step: "04",
    title: "Controlled Sharing",
    description:
      "Generate secure links with customizable permissions, expiration dates, and download limits.",
    color: "amber",
  },
];

const colorMap = {
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-500",
    glow: "rgba(245, 158, 11, 0.4)",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-500",
    glow: "rgba(168, 85, 247, 0.4)",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-500",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-500",
    glow: "rgba(34, 197, 94, 0.4)",
  },
};

function WorkflowCard({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) {
  const colors = colorMap[step.color as keyof typeof colorMap];
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative group "
    >
      {/* Animated border card */}
      <div className="relative p-px rounded-3xl overflow-hidden shadow-xl bg-black/40">
        {/* Animated border trail */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `conic-gradient(from ${index * 90}deg, transparent, ${colors.glow}, transparent)`,
            animation: "border-rotate 4s linear infinite",
          }}
        />

        {/* Card content */}
        <div className="relative rounded-3xl bg-black/80 border border-white/5 p-8 backdrop-blur-xl transition-all duration-300 group-hover:border-transparent h-full group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          {/* Glow effect on hover */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${colors.glow}, transparent 70%)`,
            }}
          />

          <div className="relative z-10 flex flex-col h-full">
            {/* Step number */}
            <div className="flex items-center justify-between mb-8">
              <span
                className={`text-xs font-bold uppercase tracking-widest ${colors.text}`}
              >
                Step {step.step}
              </span>
              <div
                className={`w-10 h-10 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center backdrop-blur-md`}
              >
                <span className={`text-sm font-bold ${colors.text}`}>
                  {index + 1}
                </span>
              </div>
            </div>

            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500/20 backdrop-blur-md`}
            >
              <Icon className={`w-8 h-8 ${colors.text}`} />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-amber-400 transition-colors">
              {step.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium flex-1">
              {step.description}
            </p>
          </div>
        </div>
      </div>

      {/* Connector arrow */}
      {index < steps.length - 1 && (
        <div className="hidden lg:flex absolute top-1/2 -right-8 transform -translate-y-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + index * 0.15 }}
            className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-xl backdrop-blur-xl"
          >
            <ArrowRight className="w-6 h-6 text-amber-500/70" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section className="relative py-32 overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/5 rounded-full blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '7s' }} />

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
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Simple Workflow
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
            Four Steps to{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700">
              Complete Protection
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Our streamlined workflow makes it easy to protect your media assets
            without compromising on security or usability.
          </p>
        </motion.div>
        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
          {steps.map((step, index) => (
            <WorkflowCard key={step.step} step={step} index={index} />
          ))}
        </div>
        {/* Connecting line for desktop */}
        <div className="hidden lg:block absolute top-1/2 mt-10 left-1/2 -translate-x-1/2 w-[75%] h-[2px] pointer-events-none z-0">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="w-full h-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent origin-left"
          />
        </div>
      </div>
    </section>
  );
}
