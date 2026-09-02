"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = createClient();

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("relative p-8 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl", className)}>
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-6"
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col gap-2 text-left mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-sm font-medium text-muted-foreground">
              Enter your credentials to access your secure vault
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="email" className="font-semibold text-foreground/90">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl bg-black/50 border-white/10 focus-visible:ring-amber-500/30 focus-visible:border-amber-500/50 transition-all font-medium placeholder:text-muted-foreground/50"
            />
          </Field>

          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password" className="font-semibold text-foreground/90">Password</FieldLabel>
              <Link
                href="/auth/forgot-password"
                className="ml-auto text-sm font-medium text-amber-500/80 hover:text-amber-400 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl bg-black/50 border-white/10 focus-visible:ring-amber-500/30 focus-visible:border-amber-500/50 transition-all font-medium placeholder:text-muted-foreground/50 tracking-widest"
            />
          </Field>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <Field className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all relative overflow-hidden group" 
              disabled={isLoading}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </Field>

          <div className="text-center text-sm font-medium text-muted-foreground mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="text-amber-500 hover:text-amber-400 transition-colors font-bold">
              Sign up
            </Link>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
