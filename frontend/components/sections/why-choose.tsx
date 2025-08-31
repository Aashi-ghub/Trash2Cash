"use client"

type Card = {
  title: string
  desc: string
  iconAlt: string
  icon: string
}

const cards: Card[] = [
  {
    title: "Polluted City",
    desc: "See the impact of human activities on the environment.",
    iconAlt: "polluted city icon",
    icon: "/polluted-city-icon.png"
  },
  {
    title: "Smart Dustbins",
    desc: "Discover innovative bins that sort and manage waste.",
    iconAlt: "smart dustbin icon",
    icon: "/smart-bin-icon.png"
  },
  {
    title: "Eco‑Friendly Rewards",
    desc: "Earn rewards for eco‑friendly actions and challenges.",
    iconAlt: "rewards icon",
    icon: "/rewards-icon.png"
  },
  { 
    title: "Cleaning Up", 
    desc: "Join interactive drives that clean and restore spaces.", 
    iconAlt: "cleanup icon",
    icon: "/cleanup-icon.png"
  },
  { 
    title: "Sustainable Future", 
    desc: "Act today to build a greener tomorrow.", 
    iconAlt: "sustainable future icon",
    icon: "/sustainable-future-icon.png"
  },
  {
    title: "Eco‑Friendly Lifestyle",
    desc: "Adopt better daily habits that help the planet.",
    iconAlt: "lifestyle icon",
    icon: "/lifestyle-icon.png"
  },
]

export function WhyChooseSection() {
  return (
    <section id="why-choose" className="w-full bg-emerald-950 text-white py-16 md:py-24 font-dosis">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <header className="mb-10 md:mb-14 text-center">
          <h2 className="text-pretty text-3xl md:text-4xl font-semibold font-bungee">Why Choose Trash2Cash</h2>
          <p className="mt-3 text-base md:text-lg text-white/70 max-w-2xl mx-auto font-dosis">
            Empowering individuals to take meaningful steps toward a greener future.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {cards.map((c, idx) => (
            <article
              key={c.title}
              className="rounded-xl border border-white/20 bg-emerald-900/40 p-6 md:p-8 transition hover:bg-emerald-900/60 text-center font-dosis"
            >
              <div className="mb-4 h-10 w-10 rounded-md bg-emerald-700/30 flex items-center justify-center mx-auto">
                <img src={c.icon} alt={c.iconAlt} className="h-8 w-8" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold font-dosis">{c.title}</h3>
              <p className="mt-2 text-sm md:text-base text-white/70 font-dosis">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection
