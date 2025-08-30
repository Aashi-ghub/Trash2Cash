export default function SimpleHero() {
  return (
    <div className="relative isolate bg-emerald-950">
      <div className="mx-auto max-w-6xl px-6 py-24 grid md:grid-cols-2 items-center gap-10">
        <div>
          <p className="text-emerald-200/80">Eco‑Friendly Adventures</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold text-white text-balance">
            Discover Your Sustainable Future
          </h1>
          <p className="mt-4 text-emerald-100/85 leading-relaxed">
            Join our platform to gamify positive actions and earn rewards while helping the planet.
          </p>
          <div className="mt-8 flex gap-3">
            <a
              href="/signup"
              className="rounded-full bg-white text-emerald-900 px-6 py-3 font-medium hover:bg-emerald-100 transition-colors"
            >
              Join Now
            </a>
            <a
              href="/how-it-works"
              className="rounded-full border border-white/30 text-white px-6 py-3 hover:bg-white/10 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="h-[320px] rounded-2xl bg-emerald-900/50 border border-emerald-200/20" />
      </div>
    </div>
  )
}
