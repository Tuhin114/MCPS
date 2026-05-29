"use client"

import { motion } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Pricing Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Simple,{" "}
            <span className="gradient-text-amber">Transparent Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core
            security features.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: plan.highlighted ? 1 : 1.02, y: plan.highlighted ? 0 : -4 }}
              className={`relative ${plan.highlighted ? "lg:-mt-8 lg:mb-8" : ""}`}
            >
              {/* Animated border for highlighted plan */}
              {plan.highlighted && (
                <div className="absolute -inset-px rounded-2xl overflow-hidden">
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(var(--border-angle, 0deg), rgba(245, 158, 11, 0.5), transparent, rgba(168, 85, 247, 0.5), transparent)`,
                      animation: 'border-rotate 4s linear infinite',
                    }}
                  />
                </div>
              )}
              
              <div className={`relative h-full rounded-2xl border p-6 backdrop-blur-sm ${
                plan.highlighted
                  ? "border-transparent bg-card shadow-xl shadow-amber-500/10"
                  : "border-border/50 bg-card/80 hover:border-amber-500/30"
              }`}>
                {/* Popular Badge */}
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-1 text-xs font-semibold text-black shadow-lg shadow-amber-500/30">
                    Most Popular
                  </div>
                )}

                {/* Glow effect for highlighted */}
                {plan.highlighted && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/10 via-transparent to-purple-500/5 pointer-events-none" />
                )}

                <div className="relative z-10">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className={`text-5xl font-bold ${plan.highlighted ? "gradient-text-amber" : "text-foreground"}`}>
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          plan.highlighted ? "bg-amber-500/20" : "bg-muted"
                        }`}>
                          <Check className={`h-3 w-3 ${plan.highlighted ? "text-amber-500" : "text-muted-foreground"}`} />
                        </div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full font-medium ${
                      plan.highlighted
                        ? "bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/20"
                        : "bg-muted/50 hover:bg-muted text-foreground border border-border/50"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
