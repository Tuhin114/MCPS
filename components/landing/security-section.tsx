"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Key, Server, Eye, CheckCircle2, Zap } from "lucide-react"
import { BackgroundLines } from "@/components/ui/aceternity-effects"

const securityFeatures = [
  {
    icon: Shield,
    title: "AES-256 Encryption",
    description: "Military-grade encryption protects every file you upload.",
  },
  {
    icon: Key,
    title: "Key Management",
    description: "Encryption keys are managed securely on our servers.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "Distributed storage with multiple redundancy layers.",
  },
  {
    icon: Lock,
    title: "Zero-Knowledge",
    description: "Your files remain encrypted even to our systems.",
  },
  {
    icon: Eye,
    title: "Access Verification",
    description: "Multi-factor authentication for sensitive operations.",
  },
  {
    icon: CheckCircle2,
    title: "Compliance Ready",
    description: "SOC 2 Type II and GDPR compliant infrastructure.",
  },
]

export function SecuritySection() {
  return (
    <section id="security" className="relative overflow-hidden py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      {/* Background lines effect */}
      <BackgroundLines className="opacity-30" />
      
      {/* Ambient glow */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
      <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              Enterprise Security
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Bank-Grade Security{" "}
              <span className="gradient-text-amber">You Can Trust</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Your files are protected by the same encryption standards used by
              governments and financial institutions worldwide.
            </p>

            {/* Security Visual */}
            <div className="relative">
              <motion.div 
                className="rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Shield className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Server-Side Protection</div>
                    <div className="text-sm text-muted-foreground">
                      All encryption keys managed securely
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: Lock, title: "Files remain encrypted in storage", desc: "Protected inside secure cloud infrastructure" },
                    { icon: Key, title: "Server controls all encryption keys", desc: "No client-side key exposure" },
                    { icon: Server, title: "Distributed redundant storage", desc: "99.99% uptime guarantee" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-3 rounded-lg border border-border/30 bg-muted/20 p-3 hover:border-amber-500/30 hover:bg-muted/40 transition-all cursor-default"
                    >
                      <item.icon className="h-5 w-5 text-amber-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-green-500 ring-4 ring-green-500/20" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 -top-4 rounded-xl border border-green-500/30 bg-card/90 backdrop-blur-sm p-3 shadow-lg shadow-green-500/10"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-foreground">SOC 2 Certified</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 bottom-8 rounded-xl border border-amber-500/30 bg-card/90 backdrop-blur-sm p-3 shadow-lg shadow-amber-500/10"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-medium text-foreground">GDPR Compliant</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Feature Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="group relative rounded-xl overflow-hidden"
              >
                {/* Animated border on hover */}
                <div className="absolute inset-0 rounded-xl p-px overflow-hidden">
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(var(--border-angle, 0deg), transparent 40%, rgba(245, 158, 11, 0.5) 50%, transparent 60%)`,
                      animation: 'border-rotate 3s linear infinite',
                    }}
                  />
                </div>
                
                <div className="relative h-full border border-border/50 bg-card/80 backdrop-blur-sm p-5 rounded-xl transition-all group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-amber-500/5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 transition-transform group-hover:scale-110">
                    <feature.icon className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="mb-1 font-semibold text-foreground group-hover:text-amber-500 transition-colors">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
