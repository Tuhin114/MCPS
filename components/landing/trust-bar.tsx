"use client"

import { motion } from "framer-motion"
import { Shield, Cloud, Eye, Lock, Zap } from "lucide-react"

const trustItems = [
  { icon: Shield, label: "AES-256 Encryption" },
  { icon: Cloud, label: "Secure Cloud Storage" },
  { icon: Eye, label: "Watermark Protection" },
  { icon: Lock, label: "Real-time Access Control" },
  { icon: Zap, label: "End-to-End Media Security" },
]

export function TrustBar() {
  return (
    <section className="relative border-y border-border/50 bg-secondary/30 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Trusted Security Features
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-4 text-center backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 -z-10 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <item.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground sm:text-sm">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
