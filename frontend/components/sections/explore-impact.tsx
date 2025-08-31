"use client"

import { useRouter } from "next/navigation"

export function ExploreImpactSection() {
  const router = useRouter()

  const handleJoinNow = () => {
    router.push("/signup")
  }

  return (
    <section className="w-full bg-emerald-950 text-white py-16 md:py-24 font-dosis">
      <div className="mx-auto max-w-6xl px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        <div className="font-dosis">
          <h2 className="text-pretty text-3xl md:text-4xl font-semibold font-bungee">Explore Our Impact</h2>
          <p className="mt-4 text-base md:text-lg text-white/75 leading-relaxed font-dosis">
            See how our platform has inspired real‑world change—from reducing waste to promoting renewable energy.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <a
              href="/learn-more"
              className="inline-flex items-center justify-center rounded-full bg-white text-emerald-900 px-6 py-3 hover:bg-emerald-100 transition font-dosis"
            >
              Learn More
            </a>
            <button
              onClick={handleJoinNow}
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 text-white px-6 py-3 hover:bg-emerald-600 transition font-medium font-dosis"
            >
              Join Now
            </button>
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
