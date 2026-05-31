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
  Video: { color: "hsl(var(--chart-1))" },
  Images: { color: "hsl(var(--chart-2))" },
  Audio: { color: "hsl(var(--chart-4))" },
  Documents: { color: "hsl(var(--chart-5))" },
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
    <section className="flex h-full flex-col rounded-xl border border-border bg-card">
      <header className="px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight">
          Storage Analytics
        </h2>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Usage breakdown by media type
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-4 border-t border-border w-full h-full p-5 sm:flex-row sm:items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-40 w-40 shrink-0"
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
              innerRadius={52}
              outerRadius={70}
              strokeWidth={3}
              stroke="var(--color-card)"
            >
              {data?.map((entry) => (
                <Cell key={entry.label} fill={entry.fill} />
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
                          className="fill-foreground text-xl font-semibold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 18}
                          className="fill-muted-foreground text-[11px]"
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

        <div className="flex flex-1 flex-col gap-2.5">
          {data?.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: item.fill }}
              />
              <span className="flex-1 text-muted-foreground">{item.label}</span>
              <span className="font-medium tabular-nums text-foreground">
                {item.value} GB
              </span>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between border-t border-border pt-2.5 text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-medium tabular-nums text-foreground">
              {remaining} GB
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
