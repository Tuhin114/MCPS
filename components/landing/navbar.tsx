"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, Shield, ArrowRight } from "lucide-react";

// ── Nav links ─────────────────────────────────────────────────────────────────
const navLinks = [
  { href: "#features",  label: "Features"  },
  { href: "#security",  label: "Security"  },
  { href: "#pricing",   label: "Pricing"   },
];

// ── Scroll-progress bar ───────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"
      style={{ scaleX }}
    />
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [scrolled,   setScrolled]     = useState(false);
  const [activeLink, setActiveLink]   = useState("");

  // ── Scroll state ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Active section detection via IntersectionObserver ───────────────────────
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveLink(`#${id}`); },
        { rootMargin: "-40% 0px -50% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ── Smooth anchor scroll ─────────────────────────────────────────────────────
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();
      setMobileOpen(false);
      const el = document.getElementById(href.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [],
  );

  return (
    <>
      <ScrollProgress />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/8 bg-background/80 backdrop-blur-2xl shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">

          {/* ── Brand ── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              whileHover={{ scale: 1.08, rotate: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30"
            >
              <Shield className="h-5 w-5 text-black" />
              {/* live green dot */}
              <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
              </span>
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight text-foreground">
                MCPS
              </span>
              <span className="text-[9px] font-mono text-amber-500/70 tracking-widest uppercase">
                Media Protection
              </span>
            </div>
          </Link>

          {/* ── Desktop links ── */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = activeLink === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group
                    ${isActive
                      ? "text-amber-500"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {/* Active/hover pill background */}
                  <span
                    className={`absolute inset-0 rounded-lg transition-opacity duration-200
                      ${isActive ? "opacity-100 bg-amber-500/10" : "opacity-0 group-hover:opacity-100 bg-white/5"}`}
                  />
                  <span className="relative">{link.label}</span>
                  {/* Active underline */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-1 left-4 right-4 h-px bg-amber-500 rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* ── Desktop CTAs ── */}
          <div className="hidden items-center gap-2.5 md:flex">
            {/* Sign in — ghost */}
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
            >
              Sign in
            </Link>

            {/* Get Started — amber CTA */}
            <Link href="/auth/sign-up">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-amber-500/25 hover:bg-amber-400 hover:shadow-amber-500/40 transition-all duration-200"
              >
                Get Started
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </motion.div>
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/5 hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-b border-white/8 bg-background/95 backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col px-6 py-5 gap-1">
                {/* Nav links */}
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.22 }}
                    className={`flex items-center justify-between py-3 px-3 rounded-lg text-sm font-medium transition-all
                      ${activeLink === link.href
                        ? "text-amber-500 bg-amber-500/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                  >
                    {link.label}
                    {activeLink === link.href && (
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    )}
                  </motion.a>
                ))}

                {/* Divider */}
                <div className="my-3 h-px bg-white/6" />

                {/* Auth CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex flex-col gap-2"
                >
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-medium text-foreground hover:bg-white/10 transition-all"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-center text-sm font-semibold text-black hover:bg-amber-400 shadow-lg shadow-amber-500/25 transition-all"
                  >
                    Get Started — It&apos;s Free
                  </Link>
                </motion.div>

                {/* Trust line */}
                <p className="mt-3 text-center text-[11px] text-muted-foreground/50">
                  No credit card required · AES-256 encrypted
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
