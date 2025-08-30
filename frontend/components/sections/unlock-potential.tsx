"use client"
import SectionReveal from "@/components/animations/section-reveal"
import { motion } from "framer-motion"

export function UnlockPotentialSection() {
  return (
    <SectionReveal className="w-full bg-white py-16 md:py-24" yParallax={[6, -24]}>
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
          <div className="order-last md:order-first">
            <motion.img
              src={"/placeholder.svg?height=520&width=640&query=green%20eco%20canister%20with%20leaves"}
              alt="Green eco canister"
              className="w-full h-auto"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
            />
          </div>
          <div>
            <h2 className="text-pretty text-3xl md:text-4xl font-semibold text-emerald-900">
              Unlock Your Sustainable Potential
            </h2>
            <p className="mt-4 text-base md:text-lg text-neutral-700 leading-relaxed">
              Join our community, take part in challenges, earn rewards, and see the collective impact we can create.
            </p>
            <div className="mt-6">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-emerald-800 px-6 py-3 text-white hover:bg-emerald-700 transition"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  )
}

export default UnlockPotentialSection
