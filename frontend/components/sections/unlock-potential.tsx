"use client"

export function UnlockPotentialSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24 font-dosis">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
          <div className="order-last md:order-first max-w-md mx-auto">
            <img
              src="/unlock.webp"
              alt="Green eco canister"
              className="w-full h-auto rounded-xl"
            />
          </div>
          <div className="font-dosis">
            <h2 className="text-pretty text-3xl md:text-4xl font-semibold text-emerald-900 font-bungee">
              Unlock Your Sustainable Potential
            </h2>
            <p className="mt-4 text-base md:text-lg text-neutral-700 leading-relaxed font-dosis">
              Join our community, take part in challenges, earn rewards, and see the collective impact we can create.
            </p>
            <div className="mt-6">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-emerald-800 px-6 py-3 text-white hover:bg-emerald-700 transition font-dosis"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UnlockPotentialSection
