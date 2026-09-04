"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for individuals getting started with media protection.",
    features: [
      "5 GB secure storage",
      "Basic AES-256 encryption",
      "Up to 10 protected files",
      "Basic watermarking",
      "Email support",
    ],
    cta: "Get Started",
    href: "/auth/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For professionals who need advanced protection features.",
    features: [
      "100 GB secure storage",
      "Advanced encryption options",
      "Unlimited protected files",
      "Dynamic watermarking",
      "Access control & tracking",
      "Analytics dashboard",
      "Priority support",
      "API access",
    ],
    cta: "Start Free Trial",
    href: "/auth/sign-up",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For organizations with advanced security requirements.",
    features: [
      "Unlimited storage",
      "Custom encryption policies",
      "Team management",
      "Advanced audit logs",
      "SSO & SAML integration",
      "Compliance reports",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "mailto:sales@example.com",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-32 overflow-hidden bg-background">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/5 rounded-full blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            Pricing Plans
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
            Simple,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700">
              Transparent Pricing
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Choose the plan that fits your needs. All plans include our core
            security features.
          </p>
        </motion.div>

        {/* ── Pricing cards ── */}
        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
              whileHover={{ scale: plan.highlighted ? 1.02 : 1.03, y: -4 }}
              className={`relative ${plan.highlighted ? "z-20 lg:-my-8" : "z-10"}`}
            >
              {/* Animated border for highlighted plan */}
              {plan.highlighted && (
                <div className="absolute -inset-px rounded-3xl overflow-hidden">
                  <div 
                    className="absolute inset-0 opacity-100"
                    style={{
                      background: `linear-gradient(var(--border-angle, 0deg), rgba(245, 158, 11, 0.8), transparent, rgba(168, 85, 247, 0.8), transparent)`,
                      animation: 'border-rotate 4s linear infinite',
                    }}
                  />
                </div>
              )}
              
              <div className={`relative h-full rounded-3xl p-8 backdrop-blur-xl transition-all duration-300 ${
                plan.highlighted
                  ? "border border-transparent bg-card shadow-2xl shadow-amber-500/20"
                  : "border border-white/10 bg-black/40 hover:border-amber-500/30"
              }`}>
                {/* Popular Badge */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-5 py-1.5 text-sm font-bold tracking-wide text-black shadow-lg shadow-amber-500/30">
                    Most Popular
                  </div>
                )}

                {/* Glow effect for highlighted */}
                {plan.highlighted && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-amber-500/10 via-transparent to-purple-500/5 pointer-events-none" />
                )}
                
                {/* Subtle top gradient for normal cards */}
                {!plan.highlighted && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                )}

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-4">{plan.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-6xl font-black tracking-tight ${plan.highlighted ? "text-transparent bg-clip-text bg-gradient-to-br from-amber-300 to-amber-600" : "text-foreground"}`}>
                        {plan.price}
                      </span>
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">/{plan.period}</span>
                    </div>
                    <p className="mt-4 text-sm font-medium text-muted-foreground leading-relaxed h-10">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="mb-10 space-y-4 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          plan.highlighted ? "bg-amber-500/20" : "bg-white/10"
                        }`}>
                          <Check className={`h-3.5 w-3.5 ${plan.highlighted ? "text-amber-500" : "text-white"}`} />
                        </div>
                        <span className="text-sm font-medium text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    size="lg"
                    className={`w-full h-14 text-base font-bold rounded-xl transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                        : "bg-white/5 hover:bg-white/10 text-foreground border border-white/10"
                    }`}
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
