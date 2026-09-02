"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });

      if (error) throw error;

      router.push("/auth/sign-up-success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("relative p-8 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl", className)}>
      <form
        onSubmit={handleSignUp}
        className="flex flex-col gap-6"
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col gap-2 text-left mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Create account</h1>
            <p className="text-sm font-medium text-muted-foreground">
              Fill in the form below to create your secure vault
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="name" className="font-semibold text-foreground/90">Full Name</FieldLabel>
            <Input
              id="name"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              required
              className="h-12 rounded-xl bg-black/50 border-white/10 focus-visible:ring-amber-500/30 focus-visible:border-amber-500/50 transition-all font-medium placeholder:text-muted-foreground/50"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email" className="font-semibold text-foreground/90">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              className="h-12 rounded-xl bg-black/50 border-white/10 focus-visible:ring-amber-500/30 focus-visible:border-amber-500/50 transition-all font-medium placeholder:text-muted-foreground/50"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password" className="font-semibold text-foreground/90">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="h-12 rounded-xl bg-black/50 border-white/10 focus-visible:ring-amber-500/30 focus-visible:border-amber-500/50 transition-all font-medium placeholder:text-muted-foreground/50 tracking-widest"
            />
            <FieldDescription className="text-xs text-muted-foreground/70 font-medium">
              Must be at least 8 characters long.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-password" className="font-semibold text-foreground/90">Confirm Password</FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
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
              disabled={isLoading} 
              className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </Field>

          <Field>
            <FieldDescription className="text-center text-sm font-medium text-muted-foreground mt-2">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-amber-500 hover:text-amber-400 transition-colors font-bold">
                Sign in
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
