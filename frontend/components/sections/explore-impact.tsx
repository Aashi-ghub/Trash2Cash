"use client"

export function ExploreImpactSection() {
  return (
    <section className="w-full bg-emerald-950 text-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        <div>
          <h2 className="text-pretty text-3xl md:text-4xl font-semibold font-bungee">Explore Our Impact</h2>
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
        <div className="relative max-w-md mx-auto">
          <img
            src="/impact.webp"
            alt="Impact illustration"
            className="w-full h-auto rounded-xl"
          />
        </div>
      </div>
    </section>
  )
}

export default ExploreImpactSection
