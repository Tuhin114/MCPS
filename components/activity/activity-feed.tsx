"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { activityFeed, categoryStyles } from "@/lib/activity-data";

const railColor: Record<string, string> = {
  protection: "bg-amber-500/60",
  sharing: "bg-purple-500/60",
  downloads: "bg-blue-500/60",
  security: "bg-emerald-500/60",
  alert: "bg-red-500/60",
};

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>Real-time protection, sharing and security events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-[560px] space-y-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
          {activityFeed.map((event, i) => {
            const cat = categoryStyles[event.category];
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex gap-3 rounded-xl p-3 transition-colors hover:bg-zinc-800/40"
              >
                <span className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-full ${railColor[event.category]}`} />
                <Avatar className="ml-2">{event.user.initials}</Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-zinc-200">{event.title}</p>
                    <Badge tone={cat.tone}>{cat.label}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">{event.description}</p>
                </div>
                <span className="shrink-0 whitespace-nowrap pt-0.5 text-xs text-zinc-500">
                  {event.timestamp}
                </span>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
