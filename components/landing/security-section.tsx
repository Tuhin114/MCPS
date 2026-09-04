"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Key, Server, Eye, FileDigit, Zap, Layers } from "lucide-react";
import { BackgroundLines } from "@/components/ui/aceternity-effects";

const securityFeatures = [
  {
    icon: Shield,
    title: "AES-256 Encryption",
    description: "Every file is encrypted with a unique 256-bit Data Encryption Key (DEK).",
  },
  {
    icon: Layers,
    title: "Envelope Encryption",
    description: "Data keys are themselves wrapped and encrypted by a secure Master Key (MEK).",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "Encrypted blobs are stored in private cloud buckets with zero public access.",
  },
  {
    icon: Eye,
    title: "Runtime Decryption",
    description: "Files are decrypted on-the-fly into memory and streamed directly to authorized viewers.",
  },
  {
    icon: FileDigit,
    title: "Embedded Watermarking",
    description: "Custom visual watermarks are burned into the binary data prior to encryption.",
  },
  {
    icon: Lock,
    title: "Strict Access Control",
    description: "Time-limited and revocable sharing links ensure total ownership control.",
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="relative overflow-hidden py-32 bg-background">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      
      {/* Background lines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <BackgroundLines className="w-full h-full" />
      </div>
      
      {/* Ambient glow */}
      <div className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '7s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* ── Left Content ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-semibold mb-6 backdrop-blur-md">
              <Zap className="w-4 h-4" />
              Cryptography Core
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-[1.1] tracking-tight">
              Bank-Grade Security{" "}
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700">
                You Can Trust
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed font-medium">
              Your files are protected by AES-256 envelope encryption. From the moment 
              of upload to the final streaming view, we ensure raw files never rest on disk unencrypted.
            </p>

            {/* Security Visual */}
            <div className="relative mt-8">
              <motion.div 
                className="rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl shadow-2xl"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
                    <Shield className="h-7 w-7 text-black" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">Server-Side Pipeline</div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Secure envelope encryption architecture
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Lock, title: "Files remain encrypted in storage", desc: "Stored in isolated secure buckets" },
                    { icon: Key, title: "Master Key (MEK) Wrapping", desc: "Unique data keys per file" },
                    { icon: Server, title: "In-memory decryption streaming", desc: "No temp files left on disk" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                      className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 hover:border-amber-500/30 hover:bg-white/10 transition-all cursor-default"
                    >
                      <div className="p-2 bg-black/30 rounded-lg">
                        <item.icon className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-foreground">{item.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                      </div>
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating Badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 -top-6 rounded-2xl border border-emerald-500/30 bg-black/80 backdrop-blur-md p-3.5 shadow-xl shadow-emerald-500/10"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-bold text-foreground">AES-256 Secured</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-6 bottom-12 rounded-2xl border border-amber-500/30 bg-black/80 backdrop-blur-md p-3.5 shadow-xl shadow-amber-500/10"
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-bold text-foreground">Strict Access Control</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Right Content - Feature Grid ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="grid gap-5 sm:grid-cols-2"
          >
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.04, y: -4 }}
                className="group relative rounded-2xl overflow-hidden shadow-lg"
              >
                {/* Animated border on hover */}
                <div className="absolute inset-0 rounded-2xl p-[1.5px] overflow-hidden bg-white/5 group-hover:bg-transparent transition-colors">
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(var(--border-angle, 0deg), transparent 40%, rgba(245, 158, 11, 0.7) 50%, transparent 60%)`,
                      animation: 'border-rotate 3s linear infinite',
                    }}
                  />
                </div>
                
                <div className="relative h-full border border-transparent bg-black/60 backdrop-blur-md p-6 rounded-2xl transition-all">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500/20">
                    <feature.icon className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground group-hover:text-amber-400 transition-colors">{feature.title}</h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
