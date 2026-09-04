"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Users } from "lucide-react";

const testimonials = [
  {
    content: "MCPS has completely transformed how we handle client deliverables. The watermarking feature alone has saved us from countless unauthorized distributions.",
    author: "Sarah Chen",
    role: "Creative Director",
    company: "Studio Lumina",
    avatar: "SC",
  },
  {
    content: "As a photographer, protecting my work is crucial. MCPS gives me peace of mind knowing my images are encrypted and trackable at all times.",
    author: "Marcus Rivera",
    role: "Professional Photographer",
    company: "Rivera Studios",
    avatar: "MR",
  },
  {
    content: "We use MCPS for all our course materials. The access control features ensure only enrolled students can view our content.",
    author: "Dr. Emily Watson",
    role: "Online Educator",
    company: "TechLearn Academy",
    avatar: "EW",
  },
  {
    content: "The enterprise features are exactly what we needed. Audit logs, team permissions, and compliance reports all in one platform.",
    author: "James Mitchell",
    role: "IT Security Manager",
    company: "Nexus Corp",
    avatar: "JM",
  },
  {
    content: "Finally a media protection solution that doesn't compromise on user experience. Our team adopted it instantly.",
    author: "Lisa Park",
    role: "Product Manager",
    company: "StreamFlow Media",
    avatar: "LP",
  },
  {
    content: "The analytics dashboard gives us insights we never had before. We can see exactly how our content is being accessed.",
    author: "David Thompson",
    role: "Marketing Director",
    company: "Brand Amplify",
    avatar: "DT",
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative flex-shrink-0 w-[380px] md:w-[420px]"
    >
      {/* Card */}
      <div className="relative h-full rounded-3xl border border-white/5 bg-black/40 p-8 transition-all duration-300 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10 hover:bg-[#0f0d0b]">
        {/* Quote Icon */}
        <Quote className="absolute right-6 top-6 h-10 w-10 text-white/5 group-hover:text-amber-500/10 transition-colors duration-300" />
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative z-10">
          {/* Stars */}
          <div className="mb-6 flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
            ))}
          </div>

          {/* Content */}
          <p className="mb-8 text-muted-foreground leading-relaxed font-medium min-h-[90px]">
            &ldquo;{testimonial.content}&rdquo;
          </p>

          {/* Author */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-black text-black shadow-lg shadow-amber-500/20">
              {testimonial.avatar}
            </div>
            <div>
              <div className="font-bold text-foreground text-lg">{testimonial.author}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-0.5 text-amber-500/80">
                {testimonial.role} <span className="text-white/20">|</span> {testimonial.company}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      if (!isHovered && scrollContainer) {
        scrollPosition += scrollSpeed;
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isHovered]);

  return (
    <section className="relative py-32 overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
      
      {/* Ambient glow */}
      <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />
      <div className="absolute right-0 bottom-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '7s' }} />

      <div className="relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center mb-20 px-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-semibold mb-6 backdrop-blur-md">
            <Users className="w-4 h-4" />
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
            Trusted by{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700">
              Creators Worldwide
            </span>
          </h2>
          <p className="text-lg md:text-xl font-medium text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of content creators, businesses, and enterprises who
            trust MCPS to protect their valuable media assets.
          </p>
        </motion.div>

        {/* Infinite scroll testimonials */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-hidden pb-8 px-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Double the testimonials for infinite scroll effect */}
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index % testimonials.length} />
          ))}
        </div>

        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />
      </div>
    </section>
  );
}
