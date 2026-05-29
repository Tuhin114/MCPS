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
    color: "purple",
  },
  {
    icon: Cloud,
    step: "03",
    title: "Secure Storage",
    description:
      "Content is stored in our distributed cloud infrastructure with multiple redundancy layers worldwide.",
    color: "blue",
  },
  {
    icon: Share2,
    step: "04",
    title: "Controlled Sharing",
    description:
      "Generate secure links with customizable permissions, expiration dates, and download limits.",
    color: "green",
  },
];

const colorMap = {
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-500",
    glow: "rgba(245, 158, 11, 0.3)",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-500",
    glow: "rgba(168, 85, 247, 0.3)",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-500",
    glow: "rgba(59, 130, 246, 0.3)",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-500",
    glow: "rgba(34, 197, 94, 0.3)",
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
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative group "
    >
      {/* Animated border card */}
      <div className="relative p-px rounded-2xl overflow-hidden">
        {/* Animated border trail */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `conic-gradient(from ${index * 90}deg, transparent, ${colors.glow}, transparent)`,
            animation: "border-rotate 3s linear infinite",
          }}
        />

        {/* Card content */}
        <div className="relative rounded-2xl bg-card/90 border border-border/50 p-6 backdrop-blur-sm transition-all duration-300 group-hover:border-transparent group-hover:shadow-lg h-full">
          {/* Glow effect on hover */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${colors.glow}, transparent 60%)`,
            }}
          />

          <div className="relative z-10">
            {/* Step number */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}
              >
                Step {step.step}
              </span>
              <div
                className={`w-8 h-8 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center`}
              >
                <span className={`text-xs font-bold ${colors.text}`}>
                  {index + 1}
                </span>
              </div>
            </div>

            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className={`w-7 h-7 ${colors.text}`} />
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-white transition-colors">
              {step.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      </div>

      {/* Connector arrow */}
      {index < steps.length - 1 && (
        <div className="hidden lg:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + index * 0.15 }}
            className="w-12 h-12 rounded-full bg-card border border-border/50 flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5 text-amber-500" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Simple Workflow
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Four Steps to{" "}
            <span className="gradient-text-amber">Complete Protection</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined workflow makes it easy to protect your media assets
            without compromising on security or usability.
          </p>
        </motion.div>
        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {steps.map((step, index) => (
            <WorkflowCard key={step.step} step={step} index={index} />
          ))}
        </div>
        {/* Connecting line for desktop */}
        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-8 w-3/4 h-px">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full h-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent origin-left"
          />
        </div>
      </div>
    </section>
  );
}
