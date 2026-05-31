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
    <section className="rounded-xl border border-border bg-card">
      <header className="px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight">Quick Actions</h2>
        <p className="mt-0.5 text-[11px] text-muted-foreground">Jump straight to common tasks</p>
      </header>

      <div className="grid grid-cols-2 gap-3 border-t border-border p-5 lg:grid-cols-4">
        {actions.map((action, i) => (
          <MotionLink
            key={action.title}
            href={action.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            whileHover="hover"
            className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-xl border border-border bg-surface-secondary p-4 text-left outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-hover hover:shadow-lg hover:shadow-black/30 focus-visible:border-primary/50"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <motion.div
              variants={{ hover: { y: -3 } }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="relative flex size-10 items-center justify-center rounded-lg bg-surface-hover ring-1 ring-border transition-colors duration-300 group-hover:bg-primary/15 group-hover:ring-primary/30"
            >
              <action.icon className="size-5 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
            </motion.div>
            <div className="relative">
              <p className="text-sm font-medium text-foreground">{action.title}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{action.description}</p>
            </div>
          </MotionLink>
        ))}
      </div>
    </section>
  )
}
