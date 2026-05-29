"use client"

import { motion } from "framer-motion"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"

const recentFiles = [
  { name: "brand_video_2024.mp4", type: "Video", size: "128 MB", status: "Encrypted", icon: Video },
  { name: "product_photos.zip", type: "Images", size: "45 MB", status: "Protected", icon: Image },
  { name: "financial_report.pdf", type: "Document", size: "2.4 MB", status: "Watermarked", icon: FileText },
  { name: "podcast_episode_47.mp3", type: "Audio", size: "67 MB", status: "Encrypted", icon: Music },
]

const activities = [
  { action: "File encrypted", file: "project_final.mp4", time: "2 min ago", color: "green" },
  { action: "Download tracked", file: "assets.zip", time: "15 min ago", color: "amber" },
  { action: "Access granted", file: "report.pdf", time: "1 hour ago", color: "blue" },
  { action: "Watermark applied", file: "photos.zip", time: "2 hours ago", color: "purple" },
]

export function DashboardPreview() {
  return (
    <section id="dashboard" className="relative overflow-hidden py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      
      {/* Ambient glow */}
      <div className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
      <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />

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
            Powerful Dashboard
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Complete Control at Your{" "}
            <span className="gradient-text-amber">Fingertips</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage all your protected content from a unified, intuitive interface
            designed for productivity and security.
          </p>
        </motion.div>

        {/* Dashboard UI */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative group"
        >
          {/* Glow effect on hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-2xl backdrop-blur-xl">
            <div className="flex">
              {/* Sidebar */}
              <div className="hidden w-56 border-r border-border/50 bg-card/50 p-4 lg:block">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20">
                    <Shield className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">MCPS</div>
                    <div className="text-xs text-muted-foreground">Enterprise</div>
                  </div>
                </div>

                <nav className="space-y-1">
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
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                        item.active
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Welcome back, manage your protected content
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative hidden sm:block">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search files..."
                        className="h-9 w-56 rounded-lg border border-border/50 bg-muted/30 pl-9 pr-4 text-sm outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="relative hover:bg-muted/30">
                      <Bell className="h-4 w-4" />
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-500" />
                    </Button>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-medium shadow-lg shadow-amber-500/20">
                      <Plus className="mr-1 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "Total Files", value: "1,247", icon: HardDrive, change: "+12%", color: "amber" },
                    { label: "Encrypted", value: "847", icon: Lock, change: "+8%", color: "green" },
                    { label: "Storage Used", value: "128 GB", icon: BarChart3, change: "+5%", color: "purple" },
                    { label: "Active Shares", value: "156", icon: Users, change: "+24%", color: "blue" },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group/card relative rounded-xl border border-border/50 bg-card/50 p-4 transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 cursor-default"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                          <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-400">
                          <TrendingUp className="h-3 w-3" />
                          {stat.change}
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Recent Files */}
                  <div className="lg:col-span-2">
                    <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">Recent Files</h4>
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-amber-500">
                          View All
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {recentFiles.map((file, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.01, x: 4 }}
                            className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/20 p-3 transition-all duration-200 hover:border-amber-500/30 hover:bg-muted/40 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
                                <file.icon className="h-5 w-5 text-amber-500" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-foreground">{file.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {file.type} • {file.size}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2 py-1 text-xs text-green-400">
                                {file.status}
                              </span>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/30">
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
                    <div className="rounded-xl border border-border/50 bg-card/50 p-4 h-full">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">Activity</h4>
                        <Activity className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="space-y-4">
                        {activities.map((activity, i) => (
                          <motion.div 
                            key={i} 
                            className="flex items-start gap-3 group/activity cursor-default"
                            whileHover={{ x: 2 }}
                          >
                            <div className={`mt-1 h-2 w-2 rounded-full bg-${activity.color}-500 ring-4 ring-${activity.color}-500/10`} />
                            <div>
                              <div className="text-sm text-foreground group-hover/activity:text-amber-500 transition-colors">{activity.action}</div>
                              <div className="text-xs text-muted-foreground">
                                {activity.file}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
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
  )
}
