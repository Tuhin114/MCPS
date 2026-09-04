import { Shield, Lock } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function Page() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background">
      {/* Left Panel: Form */}
      <div className="relative flex flex-col p-8 md:p-12 z-10">
        <div className="absolute inset-0 bg-card/30" />
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
        
        {/* Ambient glow */}
        <div className="absolute -left-1/4 top-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '7s' }} />

        <div className="relative flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-3 font-medium group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-amber-500/40">
              <Shield className="h-5 w-5 text-black" />
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">
              MCPS
            </span>
          </Link>
        </div>
        <div className="relative flex flex-1 items-center justify-center mt-12 md:mt-0">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
        <div className="relative mt-auto text-sm font-medium text-muted-foreground text-center md:text-left">
          &copy; 2026 MCPS. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Artwork */}
      <div className="relative hidden lg:flex flex-col items-center justify-center overflow-hidden border-l border-white/5 bg-black">
        {/* Video or Graphic Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-30 mix-blend-screen"
          >
            <source src="https://anfwqskgldswncpryacz.supabase.co/storage/v1/object/public/public-assets/video.mp4" type="video/mp4" />
          </video>
          {/* Gradients to blend */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
          <div className="absolute inset-0 bg-amber-500/5 mix-blend-overlay" />
        </div>

        {/* Floating security badge */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-md p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/20 mb-6">
            <Lock className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-4">
            Enterprise-Grade <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">
              Content Protection
            </span>
          </h2>
          <p className="text-muted-foreground font-medium leading-relaxed">
            Secure your digital assets with AES-256 Envelope Encryption, intelligent watermarking, and granular access controls.
          </p>
        </div>
      </div>
    </div>
  );
}

