"use client"
import SectionReveal from "@/components/animations/section-reveal"
import { motion } from "framer-motion"

export function ExploreImpactSection() {
  return (
    <SectionReveal className="w-full bg-emerald-950 text-white py-16 md:py-24" yParallax={[8, -22]}>
      <div className="mx-auto max-w-6xl px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        <div>
          <h2 className="text-pretty text-3xl md:text-4xl font-semibold">Explore Our Impact</h2>
          <p className="mt-4 text-base md:text-lg text-white/75 leading-relaxed">
            See how our platform has inspired real‑world change—from reducing waste to promoting renewable energy.
          </p>
          <div className="mt-6">
            <a
              href="/rewards"
              className="inline-flex items-center justify-center rounded-full bg-white text-emerald-900 px-6 py-3 hover:bg-emerald-100 transition"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="relative">
          <motion.img
            src={"/placeholder.svg?height=520&width=640&query=bin%20under%20glass%20dome%20with%20globe"}
            alt="Impact illustration"
            className="w-full h-auto rounded-xl"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          />
        </div>
      </div>
    </SectionReveal>
  )
}

export default ExploreImpactSection
