"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Upload,
  Lock,
  Image,
  Video,
  FileText,
  Music,
  Shield,
  Activity,
  BarChart3,
  Clock,
  Users,
  Settings,
  Search,
  Bell,
  Plus,
  MoreHorizontal,
  TrendingUp,
  HardDrive,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const recentFiles = [
  { name: "brand_video_2024.mp4", type: "Video", size: "128 MB", status: "Encrypted", icon: Video },
  { name: "product_photos.zip", type: "Images", size: "45 MB", status: "Protected", icon: Image },
  { name: "financial_report.pdf", type: "Document", size: "2.4 MB", status: "Watermarked", icon: FileText },
  { name: "podcast_episode_47.mp3", type: "Audio", size: "67 MB", status: "Encrypted", icon: Music },
];

const activities = [
  { action: "File encrypted", file: "project_final.mp4", time: "2 min ago", color: "green" },
  { action: "Download tracked", file: "assets.zip", time: "15 min ago", color: "amber" },
  { action: "Access granted", file: "report.pdf", time: "1 hour ago", color: "blue" },
  { action: "Watermark applied", file: "photos.zip", time: "2 hours ago", color: "purple" },
];

export function DashboardPreview() {
  return (
    <section id="dashboard" className="relative overflow-hidden py-32 bg-background">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
      
      {/* Ambient glow */}
      <div className="absolute right-0 top-1/4 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '7s' }} />
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

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
            Powerful Dashboard
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
            Complete Control at Your{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700">
              Fingertips
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Manage all your protected content from a unified, intuitive interface
            designed for productivity and security.
          </p>
        </motion.div>

        {/* Dashboard UI Frame */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative group mx-auto"
        >
          {/* Animated Glow effect behind */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-purple-500/30 to-amber-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0f0d0b]/90 shadow-2xl backdrop-blur-2xl">
            {/* Top Bar for OS Frame effect */}
            <div className="flex h-10 w-full items-center bg-black/50 px-4 border-b border-white/5">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
            </div>

            <div className="flex h-[800px] lg:h-[700px]">
              {/* ── Sidebar ── */}
              <div className="hidden w-64 border-r border-white/5 bg-black/40 p-5 lg:block">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
                    <Shield className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">MCPS</div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Enterprise</div>
                  </div>
                </div>

                <nav className="space-y-1.5">
                  {[
                    { icon: LayoutDashboard, label: "Dashboard", active: true },
                    { icon: Upload, label: "Upload" },
                    { icon: Lock, label: "Encrypted Files" },
                    { icon: Image, label: "Media Library" },
                    { icon: Activity, label: "Activity" },
                    { icon: BarChart3, label: "Analytics" },
                    { icon: Users, label: "Team" },
                    { icon: Settings, label: "Settings" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        item.active
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm shadow-amber-500/5"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  ))}
                </nav>
              </div>

              {/* ── Main Content ── */}
              <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">Dashboard</h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      Welcome back, manage your protected content
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search files..."
                        className="h-10 w-64 rounded-xl border border-white/10 bg-black/40 pl-9 pr-4 text-sm outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all font-medium placeholder:text-muted-foreground/70"
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="relative hover:bg-white/5 h-10 w-10 rounded-xl border border-white/5 bg-black/20">
                      <Bell className="h-4 w-4 text-foreground/80" />
                      <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    </Button>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-bold h-10 px-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all">
                      <Plus className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                </div>

                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "Total Files", value: "1,247", icon: HardDrive, change: "+12%", color: "amber" },
                    { label: "Encrypted", value: "847", icon: Lock, change: "+8%", color: "green" },
                    { label: "Storage Used", value: "128 GB", icon: BarChart3, change: "+5%", color: "purple" },
                    { label: "Active Shares", value: "156", icon: Users, change: "+24%", color: "blue" },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`group/card relative rounded-2xl border border-white/5 bg-black/40 p-5 transition-all duration-300 hover:bg-white/5 cursor-default hover:shadow-xl ${
                        stat.color === 'amber' ? 'hover:border-amber-500/30 hover:shadow-amber-500/10' :
                        stat.color === 'green' ? 'hover:border-green-500/30 hover:shadow-green-500/10' :
                        stat.color === 'purple' ? 'hover:border-purple-500/30 hover:shadow-purple-500/10' :
                        'hover:border-blue-500/30 hover:shadow-blue-500/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-transform group-hover/card:scale-110 ${
                          stat.color === 'amber' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                          stat.color === 'green' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                          stat.color === 'purple' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' :
                          'bg-blue-500/10 border-blue-500/20 text-blue-500'
                        }`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-400 border border-green-500/20">
                          <TrendingUp className="h-3 w-3" />
                          {stat.change}
                        </div>
                      </div>
                      <div>
                        <div className="text-3xl font-black text-foreground mb-1">{stat.value}</div>
                        <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Recent Files */}
                  <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-white/5 bg-black/40 p-6 h-full">
                      <div className="mb-6 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-foreground">Recent Files</h4>
                        <Button variant="ghost" size="sm" className="text-xs font-semibold text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10">
                          View All
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {recentFiles.map((file, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.01, x: 4 }}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-all duration-200 hover:border-amber-500/30 hover:bg-white/10 cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 transition-colors group-hover:bg-amber-500/20">
                                <file.icon className="h-5 w-5 text-amber-500" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-foreground mb-0.5">{file.name}</div>
                                <div className="text-xs font-medium text-muted-foreground">
                                  {file.type} • {file.size}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                                {file.status}
                              </span>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/10 text-muted-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div>
                    <div className="rounded-2xl border border-white/5 bg-black/40 p-6 h-full">
                      <div className="mb-6 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-foreground">Activity</h4>
                        <Activity className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="space-y-6">
                        {activities.map((activity, i) => (
                          <motion.div 
                            key={i} 
                            className="flex items-start gap-4 group/activity cursor-default relative"
                            whileHover={{ x: 4 }}
                          >
                            {/* Connection line */}
                            {i !== activities.length - 1 && (
                              <div className="absolute left-2.5 top-6 bottom-[-24px] w-px bg-white/10 group-hover/activity:bg-amber-500/30 transition-colors" />
                            )}
                            
                            <div className={`relative z-10 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-black border-2 shadow-lg ${
                              activity.color === 'green' ? 'border-green-500/50 shadow-green-500/20' :
                              activity.color === 'amber' ? 'border-amber-500/50 shadow-amber-500/20' :
                              activity.color === 'blue' ? 'border-blue-500/50 shadow-blue-500/20' :
                              'border-purple-500/50 shadow-purple-500/20'
                            }`}>
                              <div className={`h-2 w-2 rounded-full ${
                                activity.color === 'green' ? 'bg-green-500' :
                                activity.color === 'amber' ? 'bg-amber-500' :
                                activity.color === 'blue' ? 'bg-blue-500' :
                                'bg-purple-500'
                              }`} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-foreground group-hover/activity:text-amber-400 transition-colors">{activity.action}</div>
                              <div className="text-xs font-medium text-muted-foreground mt-0.5">
                                {activity.file}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 mt-1.5">
                                <Clock className="h-3 w-3" />
                                {activity.time}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
