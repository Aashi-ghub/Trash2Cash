"use client"

type Card = {
  title: string
  desc: string
  iconAlt: string
}

const cards: Card[] = [
  {
    title: "Polluted City",
    desc: "See the impact of human activities on the environment.",
    iconAlt: "polluted city icon",
  },
  {
    title: "Smart Dustbins",
    desc: "Discover innovative bins that sort and manage waste.",
    iconAlt: "smart dustbin icon",
  },
  {
    title: "Eco‑Friendly Rewards",
    desc: "Earn rewards for eco‑friendly actions and challenges.",
    iconAlt: "rewards icon",
  },
  { title: "Cleaning Up", desc: "Join interactive drives that clean and restore spaces.", iconAlt: "cleanup icon" },
  { title: "Sustainable Future", desc: "Act today to build a greener tomorrow.", iconAlt: "sustainable future icon" },
  {
    title: "Eco‑Friendly Lifestyle",
    desc: "Adopt better daily habits that help the planet.",
    iconAlt: "lifestyle icon",
  },
]
import { motion } from "framer-motion"

export function WhyChooseSection() {
  return (
    <section className="w-full bg-emerald-950 text-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <header className="mb-10 md:mb-14 text-center">
          <h2 className="text-pretty text-3xl md:text-4xl font-semibold">Why Choose Trash2Cash</h2>
          <p className="mt-3 text-base md:text-lg text-white/70 max-w-2xl mx-auto">
            Empowering individuals to take meaningful steps toward a greener future.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {cards.map((c, idx) => (
            <motion.article
              key={c.title}
              className="rounded-xl border border-white/20 bg-emerald-900/40 p-6 md:p-8 transition hover:bg-emerald-900/60"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.04 * idx, type: "spring", stiffness: 120, damping: 16 }}
            >
              <div className="mb-4 h-10 w-10 rounded-md bg-emerald-700/30 flex items-center justify-center">
                <img src={"/placeholder.svg?height=40&width=40&query=eco%20icon"} alt={c.iconAlt} className="h-8 w-8" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm md:text-base text-white/70">{c.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection
