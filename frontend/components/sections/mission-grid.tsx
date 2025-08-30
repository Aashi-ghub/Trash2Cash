import Image from "next/image"

export default function MissionGrid() {
  const items = [
    {
      title: "Polluted City",
      copy: "See the impact of human activities on the environment.",
      imgAlt: "polluted city icon",
    },
    {
      title: "Smart Dustbins",
      copy: "Discover innovative smart dustbins that sort and manage waste.",
      imgAlt: "smart dustbin icon",
    },
    {
      title: "Eco‑Friendly Rewards",
      copy: "Engage with our gamified platform and earn eco‑rewards.",
      imgAlt: "rewards icon",
    },
    {
      title: "Cleaning Up",
      copy: "Dive into the experience as the community cleans up waste.",
      imgAlt: "cleaning icon",
    },
    {
      title: "Sustainable Future",
      copy: "Explore a greener future where actions have impact.",
      imgAlt: "sustainable future icon",
    },
    {
      title: "Eco‑Friendly Lifestyle",
      copy: "Immerse yourself in eco‑living and best practices.",
      imgAlt: "lifestyle icon",
    },
  ]

  return (
    <section className="bg-emerald-950">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-balance">About Our Mission</h2>
          <p className="mt-3 text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
            We empower individuals to take meaningful steps toward a greener future.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-emerald-200/20 bg-emerald-900/40 p-6 hover:bg-emerald-900/60 transition-colors"
            >
              <div className="flex items-start gap-4">
                <Image
                  src={`../publi`}
                  alt={item.imgAlt}
                  width={48}
                  height={48}
                  className="rounded"
                />
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="mt-2 text-emerald-100/80 text-sm leading-relaxed">{item.copy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
