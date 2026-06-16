"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NodeData {
  id: string;
  city: string;
  lat: number;
  lng: number;
}
interface NodeState extends NodeData {
  x: number;
  y: number;
  pulsePhase: number;
}
interface Route {
  from: string;
  to: string;
  packets: Packet[];
  glowIntensity: number;
}
interface Packet {
  id: number;
  t: number;
  speed: number;
  label: string | null;
  labelOpacity: number;
}
interface ParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  repeatDelay: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NODES_DATA: NodeData[] = [
  { id: "ny", city: "New York", lat: 40.71, lng: -74.01 },
  { id: "ld", city: "London", lat: 51.51, lng: -0.13 },
  { id: "be", city: "Berlin", lat: 52.52, lng: 13.41 },
  { id: "mu", city: "Mumbai", lat: 19.08, lng: 72.88 },
  { id: "sg", city: "Singapore", lat: 1.35, lng: 103.82 },
  { id: "tk", city: "Tokyo", lat: 35.69, lng: 139.69 },
  { id: "sy", city: "Sydney", lat: -33.87, lng: 151.21 },
];

const ROUTES_DATA = [
  { from: "mu", to: "ld" },
  { from: "tk", to: "ny" },
  { from: "sg", to: "be" },
  { from: "sy", to: "ld" },
  { from: "ny", to: "be" },
  { from: "sg", to: "tk" },
];

const ENCRYPTION_LABELS = [
  "AES-256",
  "Encrypted",
  "Protected",
  "Verified",
  "Secure Link",
  "Authenticated",
];

const PACKET_SPAWN_INTERVAL = 2400;

// Lat crop: 55°S → 72°N  (removes polar emptiness, spreads nodes across canvas)
const LAT_MAX = 72;
const LAT_MIN = -55;
const LAT_RANGE = LAT_MAX - LAT_MIN; // 127°

// ─── Projection ───────────────────────────────────────────────────────────────

function project(lat: number, lng: number, w: number, h: number) {
  return {
    x: ((lng + 180) / 360) * w,
    y: ((LAT_MAX - lat) / LAT_RANGE) * h,
  };
}

// ─── Great-circle ─────────────────────────────────────────────────────────────

function toRad(d: number) {
  return (d * Math.PI) / 180;
}

function gcPoint(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  t: number,
) {
  const φ1 = toRad(lat1),
    λ1 = toRad(lng1),
    φ2 = toRad(lat2),
    λ2 = toRad(lng2);
  const a =
    Math.sin((φ2 - φ1) / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2;
  const d = 2 * Math.asin(Math.sqrt(a));
  if (d === 0) return { lat: lat1, lng: lng1 };
  const A = Math.sin((1 - t) * d) / Math.sin(d),
    B = Math.sin(t * d) / Math.sin(d);
  const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
  const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
  const z = A * Math.sin(φ1) + B * Math.sin(φ2);
  return {
    lat: (Math.atan2(z, Math.sqrt(x ** 2 + y ** 2)) * 180) / Math.PI,
    lng: (Math.atan2(y, x) * 180) / Math.PI,
  };
}

function buildRoutePath(
  from: NodeState,
  to: NodeState,
  w: number,
  h: number,
  steps = 80,
) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const { lat, lng } = gcPoint(from.lat, from.lng, to.lat, to.lng, i / steps);
    pts.push(project(lat, lng, w, h));
  }
  return pts;
}

// ─── World map polygon data ───────────────────────────────────────────────────
// Simplified Natural Earth 110m land polygons encoded as [lng,lat] pairs.
// Each sub-array is one closed ring. Sufficient detail to clearly show continents.

type Ring = [number, number][];

// We fetch from a reliable CDN at runtime — no bundled data needed.
// The component renders correctly with or without the map (graceful degradation).

function drawWorldMap(
  ctx: CanvasRenderingContext2D,
  rings: Ring[],
  w: number,
  h: number,
) {
  ctx.save();
  ctx.fillStyle = "rgba(90, 58, 8, 0.22)";
  ctx.strokeStyle = "rgba(180, 130, 35, 0.4)";
  ctx.lineWidth = 0.55;
  ctx.lineJoin = "round";

  for (const ring of rings) {
    if (ring.length < 3) continue;
    ctx.beginPath();
    let started = false;
    for (const [lng, lat] of ring) {
      if (lat > LAT_MAX + 6 || lat < LAT_MIN - 6) continue;
      const { x, y } = project(lat, lng, w, h);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawGraticule(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(140,95,15,0.10)";
  ctx.lineWidth = 0.4;
  for (let lat = -60; lat <= 72; lat += 20) {
    const y = project(lat, 0, w, h).y;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = project(0, lng, w, h).x;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  ctx.restore();
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SecureGlobalDistribution() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const packetCountRef = useRef<number>(0);
  const spawnTimers = useRef<Record<string, number>>({});
  const mapRings = useRef<Ring[]>([]);

  const nodesRef = useRef<NodeState[]>([]);
  const routesRef = useRef<Route[]>([]);
  const hoveredNodeRef = useRef<string | null>(null);
  const hoveredRouteRef = useRef<string | null>(null);

  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [mapLoaded, setMapLoaded] = useState(false);

  // ── Resize ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ w: width, h: height });
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Load world map GeoJSON ─────────────────────────────────────────────────
  useEffect(() => {
    // Natural Earth 110m countries via unpkg (reliable, always available)
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then((r) => r.json())
      .then((topo) => {
        // world-atlas is TopoJSON — decode the arcs manually (no topojson-client needed)
        const arcs: number[][][] = topo.arcs;
        const scale = topo.transform.scale as [number, number];
        const translate = topo.transform.translate as [number, number];

        // Decode delta-encoded arcs into absolute [lng,lat] coordinates
        const decodedArcs: [number, number][][] = arcs.map((arc) => {
          let x = 0,
            y = 0;
          return arc.map(([dx, dy]) => {
            x += dx;
            y += dy;
            return [
              x * scale[0] + translate[0],
              y * scale[1] + translate[1],
            ] as [number, number];
          });
        });

        // Collect all polygon rings from the "countries" geometry collection
        const rings: Ring[] = [];
        const countries = topo.objects.countries;
        for (const geom of countries.geometries) {
          const collectPolygon = (arcsIdx: (number | number[])[]) => {
            const ring: Ring = [];
            for (const arcRef of arcsIdx as number[]) {
              const idx = arcRef < 0 ? ~arcRef : arcRef;
              const pts = decodedArcs[idx];
              const segment = arcRef < 0 ? [...pts].reverse() : pts;
              for (const pt of segment) ring.push(pt as [number, number]);
            }
            rings.push(ring);
          };

          if (geom.type === "Polygon") {
            for (const ring of geom.arcs) collectPolygon(ring);
          } else if (geom.type === "MultiPolygon") {
            for (const poly of geom.arcs) {
              for (const ring of poly) collectPolygon(ring);
            }
          }
        }

        mapRings.current = rings;
        setMapLoaded(true);
      })
      .catch(() => {
        // Silently degrade — nodes & routes still render without the map
        setMapLoaded(true);
      });
  }, []);

  // ── Init nodes & routes ────────────────────────────────────────────────────
  useEffect(() => {
    if (!dimensions.w) return;
    const { w, h } = dimensions;
    nodesRef.current = NODES_DATA.map((n) => ({
      ...n,
      ...project(n.lat, n.lng, w, h),
      pulsePhase: Math.random() * Math.PI * 2,
    }));
    routesRef.current = ROUTES_DATA.map((r) => ({
      ...r,
      packets: [],
      glowIntensity: 0,
    }));
    spawnTimers.current = {};
    ROUTES_DATA.forEach((r) => {
      spawnTimers.current[`${r.from}-${r.to}`] =
        Math.random() * PACKET_SPAWN_INTERVAL;
    });
  }, [dimensions]);

  // ── Mouse ──────────────────────────────────────────────────────────────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left,
        my = e.clientY - rect.top;

      let fn: string | null = null;
      for (const n of nodesRef.current) {
        if (Math.hypot(n.x - mx, n.y - my) < 18) {
          fn = n.id;
          break;
        }
      }
      hoveredNodeRef.current = fn;
      setHoveredCity(
        fn ? nodesRef.current.find((n) => n.id === fn)!.city : null,
      );

      let fr: string | null = null;
      if (!fn) {
        for (const route of routesRef.current) {
          const from = nodesRef.current.find((n) => n.id === route.from)!;
          const to = nodesRef.current.find((n) => n.id === route.to)!;
          if (!from || !to) continue;
          const mid = gcPoint(from.lat, from.lng, to.lat, to.lng, 0.5);
          const mp = project(mid.lat, mid.lng, dimensions.w, dimensions.h);
          if (Math.hypot(mp.x - mx, mp.y - my) < 24) {
            fr = `${route.from}-${route.to}`;
            break;
          }
        }
      }
      hoveredRouteRef.current = fr;
    },
    [dimensions],
  );

  const handleMouseLeave = useCallback(() => {
    hoveredNodeRef.current = null;
    hoveredRouteRef.current = null;
    setHoveredCity(null);
  }, []);

  // ── Animation loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!dimensions.w || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.w * dpr;
    canvas.height = dimensions.h * dpr;
    ctx.scale(dpr, dpr);
    const { w, h } = dimensions;

    function frame(ts: number) {
      const dt = Math.min(ts - lastTimeRef.current, 50);
      lastTimeRef.current = ts;

      // Spawn & advance packets
      for (const route of routesRef.current) {
        const key = `${route.from}-${route.to}`;
        spawnTimers.current[key] = (spawnTimers.current[key] ?? 0) + dt;
        if (spawnTimers.current[key] >= PACKET_SPAWN_INTERVAL) {
          spawnTimers.current[key] = 0;
          const showLabel = Math.random() < 0.35;
          route.packets.push({
            id: packetCountRef.current++,
            t: 0,
            speed: 0.00016 + Math.random() * 0.00014,
            label: showLabel
              ? ENCRYPTION_LABELS[
                  Math.floor(Math.random() * ENCRYPTION_LABELS.length)
                ]
              : null,
            labelOpacity: 0,
          });
        }
        const hovN =
          hoveredNodeRef.current === route.from ||
          hoveredNodeRef.current === route.to;
        const hovR = hoveredRouteRef.current === key;
        route.glowIntensity +=
          ((hovN || hovR ? 1 : 0) - route.glowIntensity) * 0.08;
        const sm = hovN || hovR ? 1.7 : 1;
        route.packets = route.packets.filter((p) => {
          p.t += p.speed * dt * sm;
          p.labelOpacity =
            p.t < 0.5
              ? Math.min(1, p.labelOpacity + 0.04)
              : Math.max(0, p.labelOpacity - 0.04);
          return p.t < 1;
        });
      }

      ctx.clearRect(0, 0, w, h);

      // Background glow
      const bg = ctx.createRadialGradient(
        w * 0.5,
        h * 0.5,
        0,
        w * 0.5,
        h * 0.5,
        w * 0.6,
      );
      bg.addColorStop(0, "rgba(90,52,6,0.08)");
      bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Graticule
      drawGraticule(ctx, w, h);

      // World map
      if (mapRings.current.length > 0)
        drawWorldMap(ctx, mapRings.current, w, h);

      // Routes & packets
      for (const route of routesRef.current) {
        const from = nodesRef.current.find((n) => n.id === route.from)!;
        const to = nodesRef.current.find((n) => n.id === route.to)!;
        if (!from || !to) continue;
        const pts = buildRoutePath(from, to, w, h);
        const glow = route.glowIntensity;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.strokeStyle = `rgba(212,160,40,${0.26 + glow * 0.42})`;
        ctx.lineWidth = 1 + glow * 1.6;
        if (glow > 0.1) {
          ctx.shadowColor = "rgba(240,180,40,0.8)";
          ctx.shadowBlur = 8 + glow * 14;
        }
        ctx.stroke();
        ctx.restore();

        for (const pkt of route.packets) {
          const idx = Math.min(
            Math.floor(pkt.t * (pts.length - 1)),
            pts.length - 1,
          );
          const pt = pts[idx];
          ctx.save();
          const halo = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 10);
          halo.addColorStop(0, "rgba(255,200,80,0.5)");
          halo.addColorStop(1, "rgba(255,200,80,0)");
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          ctx.save();
          ctx.shadowColor = "rgba(255,190,50,0.9)";
          ctx.shadowBlur = 12;
          ctx.fillStyle = "rgba(255,215,90,0.95)";
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          if (pkt.label && pkt.labelOpacity > 0.01) {
            ctx.save();
            ctx.globalAlpha = pkt.labelOpacity * 0.82;
            ctx.font = "600 9px 'SF Mono','Fira Code',monospace";
            ctx.fillStyle = "rgba(255,215,100,1)";
            ctx.shadowColor = "rgba(160,105,8,0.7)";
            ctx.shadowBlur = 5;
            ctx.fillText(pkt.label, pt.x + 10, pt.y - 10);
            ctx.restore();
          }
        }
      }

      // Nodes
      const now = ts / 1000;
      for (const node of nodesRef.current) {
        const isH = hoveredNodeRef.current === node.id;
        const pulse = Math.sin(now * 1.8 + node.pulsePhase);
        const outerR = isH ? 18 : 13 + pulse * 2;

        ctx.save();
        const rg = ctx.createRadialGradient(
          node.x,
          node.y,
          4,
          node.x,
          node.y,
          outerR,
        );
        rg.addColorStop(
          0,
          `rgba(240,180,40,${isH ? 0.55 : 0.28 + pulse * 0.08})`,
        );
        rg.addColorStop(1, "rgba(240,180,40,0)");
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(node.x, node.y, outerR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = `rgba(220,170,50,${isH ? 0.95 : 0.6 + pulse * 0.15})`;
        ctx.lineWidth = isH ? 1.8 : 1.2;
        ctx.shadowColor = "rgba(255,190,50,0.9)";
        ctx.shadowBlur = isH ? 16 : 8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = isH ? "rgba(255,235,120,1)" : "rgba(255,210,80,0.92)";
        ctx.shadowColor = "rgba(255,200,60,1)";
        ctx.shadowBlur = isH ? 20 : 12;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (isH) {
          ctx.save();
          ctx.font = "600 11px system-ui,sans-serif";
          ctx.fillStyle = "rgba(255,235,140,0.98)";
          ctx.shadowColor = "rgba(0,0,0,0.8)";
          ctx.shadowBlur = 8;
          ctx.fillText(node.city, node.x + 14, node.y + 4);
          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(frame);
    }

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [dimensions, mapLoaded]);

  return (
    <section
      className="relative w-full bg-[#070503] overflow-hidden"
      style={{ minHeight: 780 }}
    >
      {/* Ambient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%,rgba(110,65,8,0.14) 0%,transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% 0%,rgba(55,30,4,0.18) 0%,transparent 65%)",
        }}
      />

      <FloatingParticles />

      {/* Text */}
      <div className="relative z-10 flex flex-col items-center pt-16 pb-4 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-4 inline-block rounded-full border border-amber-700/40 bg-amber-900/20 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500"
        >
          End-to-End Encrypted
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.22 }}
          className="max-w-2xl text-4xl font-bold tracking-tight text-amber-50 sm:text-5xl"
        >
          Secure Global Media{" "}
          <span
            style={{
              background:
                "linear-gradient(90deg,#f59e0b 0%,#d97706 55%,#92400e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Distribution
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38 }}
          className="mt-4 max-w-xl text-base text-amber-200/45 leading-relaxed"
        >
          Protect, encrypt, and distribute digital content securely across the
          world with authenticated access control.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-5 flex items-center gap-2 rounded-full border border-amber-800/30 bg-amber-950/30 px-4 py-1.5 text-xs text-amber-400/80 font-mono"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
          </span>
          7 secure nodes active · AES-256 encryption
        </motion.div>
      </div>

      {/* Canvas */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, delay: 0.5 }}
        className="relative z-10 w-full"
        style={{ height: 460 }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ cursor: "crosshair" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        <AnimatePresence>
          {hoveredCity && (
            <motion.div
              key={hoveredCity}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-lg border border-amber-700/40 bg-amber-950/80 px-4 py-2 text-sm font-semibold text-amber-300 backdrop-blur-sm"
            >
              🔒 {hoveredCity} — Secure Node
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="relative z-10 flex flex-wrap justify-center gap-8 pb-12 px-6"
      >
        {[
          { label: "AES-256 Encryption", icon: "⬡" },
          { label: "Authenticated Access", icon: "◈" },
          { label: "Zero-Trust Delivery", icon: "◎" },
        ].map(({ label, icon }) => (
          <div
            key={label}
            className="flex items-center gap-2 text-xs text-amber-500/55 font-mono"
          >
            <span className="text-amber-600 text-sm">{icon}</span>
            {label}
          </div>
        ))}
      </motion.div>
    </section>
  );
}

// ─── Floating Particles ───────────────────────────────────────────────────────

function FloatingParticles() {
  const [particles, setParticles] = useState<ParticleData[] | null>(null);

  useEffect(() => {
    setParticles(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.8,
        duration: 9 + Math.random() * 12,
        delay: Math.random() * 8,
        driftX: (Math.random() - 0.5) * 3,
        driftY: -(Math.random() * 2 + 1),
        repeatDelay: Math.random() * 4,
      })),
    );
  }, []);

  if (!particles) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-500"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: 0,
          }}
          animate={{
            x: [0, p.driftX * 20],
            y: [0, p.driftY * 40],
            opacity: [0, 0.35, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: p.repeatDelay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
