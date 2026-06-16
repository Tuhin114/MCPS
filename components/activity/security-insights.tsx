"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { securityInsights } from "@/lib/activity-data";

export function SecurityInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Insights</CardTitle>
        <CardDescription>
          Protection coverage across your file library
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {securityInsights.map((item, i) => {
          const pct = Math.round((item.value / item.total) * 100);
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-300">{item.label}</span>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
                <span className="text-sm font-medium tabular-nums text-zinc-200">
                  {item.value.toLocaleString()}
                  <span className="ml-1 text-zinc-500">
                    / {item.total.toLocaleString()}
                  </span>
                </span>
              </div>
              <Progress value={pct} />
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
