"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardData } from "@/types/dashboard";

async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch("/api/dashboard");

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
}

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,

    staleTime: 1000 * 60 * 5, // 5 min

    refetchOnWindowFocus: false,
  });
}
