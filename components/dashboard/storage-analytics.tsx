"use client";

import { Cell, Label, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { StorageBreakdown } from "@/types/dashboard";

const chartConfig = {
  Video: { color: "#f59e0b" }, // Amber 500
  Images: { color: "#10b981" }, // Green 500
  Audio: { color: "#8b5cf6" }, // Purple 500
  Documents: { color: "#3b82f6" }, // Blue 500
} as ChartConfig;

export function StorageAnalytics({
  data,
}: {
  data?: StorageBreakdown[] | undefined;
}) {
  const total = data?.reduce((acc, cur) => acc + cur.value, 0) || 0;
  const capacity = 1024;
  const remaining = capacity - total;

  return (
    <section className="flex h-full flex-col rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
      <header className="px-6 py-5 bg-white/[0.02] border-b border-white/5">
        <h2 className="text-base font-bold tracking-tight text-foreground">
          Storage Analytics
        </h2>
        <p className="mt-1 text-xs font-medium text-muted-foreground/80">
          Usage breakdown by media type
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-6 w-full h-full p-6 sm:flex-row sm:items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-44 w-44 shrink-0 drop-shadow-[0_0_15px_rgba(245,158,11,0.1)]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={58}
              outerRadius={80}
              strokeWidth={4}
              stroke="rgba(0,0,0,0.8)"
            >
              {data?.map((entry) => (
                <Cell 
                  key={entry.label} 
                  fill={
                    entry.label === 'Video' ? chartConfig.Video.color :
                    entry.label === 'Images' ? chartConfig.Images.color :
                    entry.label === 'Audio' ? chartConfig.Audio.color :
                    chartConfig.Documents.color
                  } 
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-black"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 20}
                          className="fill-muted-foreground/80 text-xs font-medium"
                        >
                          GB used
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex flex-1 flex-col gap-3">
          {data?.map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-sm group">
              <span
                className="size-3 shrink-0 rounded-full transition-transform group-hover:scale-125"
                style={{ 
                  backgroundColor: 
                    item.label === 'Video' ? chartConfig.Video.color :
                    item.label === 'Images' ? chartConfig.Images.color :
                    item.label === 'Audio' ? chartConfig.Audio.color :
                    chartConfig.Documents.color,
                  boxShadow: `0 0 10px ${
                    item.label === 'Video' ? chartConfig.Video.color :
                    item.label === 'Images' ? chartConfig.Images.color :
                    item.label === 'Audio' ? chartConfig.Audio.color :
                    chartConfig.Documents.color
                  }40`
                }}
              />
              <span className="flex-1 font-medium text-muted-foreground group-hover:text-amber-50 transition-colors">{item.label}</span>
              <span className="font-semibold tabular-nums text-foreground group-hover:text-amber-400 transition-colors">
                {item.value} GB
              </span>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3 text-sm">
            <span className="font-medium text-muted-foreground/80">Remaining</span>
            <span className="font-bold tabular-nums text-foreground">
              {remaining} GB
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
