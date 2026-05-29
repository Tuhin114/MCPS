"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { motion } from "framer-motion";

export function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 4,
      baseColor: [0.15, 0.15, 0.15],
      markerColor: [0.96, 0.62, 0.04],
      glowColor: [0.96, 0.62, 0.04],
      markers: [
        { location: [37.7749, -122.4194], size: 0.05 }, // SF
        { location: [40.7128, -74.006], size: 0.05 }, // NYC
        { location: [51.5074, -0.1278], size: 0.05 }, // London
        { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
        { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
        { location: [48.8566, 2.3522], size: 0.05 }, // Paris
        { location: [1.3521, 103.8198], size: 0.05 }, // Singapore
        { location: [55.7558, 37.6173], size: 0.05 }, // Moscow
        { location: [-23.5505, -46.6333], size: 0.05 }, // Sao Paulo
        { location: [19.4326, -99.1332], size: 0.05 }, // Mexico City
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={`relative aspect-square ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ contain: "layout paint size" }}
      />
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

export function GlobeSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Global Infrastructure
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Secure Global{" "}
              <span className="gradient-text-amber">Media Access</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Protect and access your digital assets securely from anywhere in
              the world. Our distributed infrastructure ensures lightning-fast
              delivery with enterprise-grade security across every continent.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "99.99%", label: "Uptime SLA" },
                { value: "45+", label: "Global Regions" },
                { value: "<50ms", label: "Avg Latency" },
                { value: "256-bit", label: "Encryption" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="p-4 rounded-lg bg-card/50 border border-border/50"
                >
                  <div className="text-2xl font-bold text-amber-500">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Globe className="w-full max-w-[500px] mx-auto" />

            {/* Floating connection indicators */}
            <motion.div
              className="absolute top-1/4 right-0 px-3 py-2 rounded-lg glass-card text-xs"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-foreground">Secure Transfer Active</span>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-1/4 left-0 px-3 py-2 rounded-lg glass-card text-xs"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-foreground">45 Regions Online</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
