import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/services/dashboard.service";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const dashboardData = await getDashboardData(user.id);

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch dashboard data",
      },
      {
        status: 500,
      },
    );
  }
}
