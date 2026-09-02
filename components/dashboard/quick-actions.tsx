"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Upload, FolderLock, Share2, ShieldCheck } from "lucide-react"

const MotionLink = motion.create(Link)

const actions = [
  { title: "Upload Media", description: "Add new files", icon: Upload, href: "/upload" },
  { title: "My Media", description: "Browse library", icon: FolderLock, href: "/media" },
  { title: "Share Media", description: "Create secure links", icon: Share2, href: "/shared" },
  { title: "Secure Media", description: "Apply protection", icon: ShieldCheck, href: "/upload" },
]

export function QuickActions() {
  return (
    <section className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
      <header className="px-6 py-5 bg-white/[0.02] border-b border-white/5">
        <h2 className="text-base font-bold tracking-tight text-foreground">Quick Actions</h2>
        <p className="mt-1 text-xs font-medium text-muted-foreground/80">Jump straight to common tasks</p>
      </header>

      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, i) => (
          <MotionLink
            key={action.title}
            href={action.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            whileHover="hover"
            className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 text-left outline-none transition-all duration-300 hover:bg-white/[0.04] hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-500/30"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/[0.05] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <motion.div
              variants={{ hover: { y: -3, scale: 1.05 } }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="relative flex size-12 items-center justify-center rounded-xl bg-black/50 border border-white/5 transition-colors duration-300 group-hover:border-amber-500/20 group-hover:bg-amber-500/10"
            >
              <action.icon className="size-5.5 text-muted-foreground transition-colors duration-300 group-hover:text-amber-500" />
            </motion.div>
            <div className="relative">
              <p className="text-sm font-bold text-foreground group-hover:text-amber-50 transition-colors">{action.title}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground/70">{action.description}</p>
            </div>
          </MotionLink>
        ))}
      </div>
    </section>
  )
}
