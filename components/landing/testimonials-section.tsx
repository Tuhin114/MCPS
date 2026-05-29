"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Star, Quote, Users } from "lucide-react"

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
]

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative flex-shrink-0 w-[350px] md:w-[400px]"
    >
      {/* Card */}
      <div className="relative h-full rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5">
        {/* Quote Icon */}
        <Quote className="absolute right-4 top-4 h-8 w-8 text-amber-500/10" />
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
          {/* Stars */}
          <div className="mb-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
            ))}
          </div>

          {/* Content */}
          <p className="mb-6 text-muted-foreground leading-relaxed">
            &ldquo;{testimonial.content}&rdquo;
          </p>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-sm font-semibold text-black">
              {testimonial.avatar}
            </div>
            <div>
              <div className="font-semibold text-foreground">{testimonial.author}</div>
              <div className="text-sm text-muted-foreground">
                {testimonial.role}, {testimonial.company}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5

    const animate = () => {
      if (!isHovered && scrollContainer) {
        scrollPosition += scrollSpeed
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0
        }
        scrollContainer.scrollLeft = scrollPosition
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isHovered])

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      
      {/* Ambient glow */}
      <div className="absolute left-0 top-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
      <div className="absolute right-0 bottom-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px]" />

      <div className="relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 px-6"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium mb-6">
            <Users className="w-3.5 h-3.5" />
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Trusted by{" "}
            <span className="gradient-text-amber">Creators Worldwide</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of content creators, businesses, and enterprises who
            trust MCPS to protect their valuable media assets.
          </p>
        </motion.div>

        {/* Infinite scroll testimonials */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden pb-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Double the testimonials for infinite scroll effect */}
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index % testimonials.length} />
          ))}
        </div>

        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />
      </div>
    </section>
  )
}
