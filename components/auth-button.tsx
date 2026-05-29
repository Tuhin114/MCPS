import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="hidden items-center gap-3 md:flex">
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground hover:bg-white/5"
      >
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button
        size="sm"
        className="bg-amber-500 hover:bg-amber-600 text-black font-medium shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
      >
        <Link href="/auth/sign-up">Get Started</Link>
      </Button>
    </div>
  );
}
