import SectionReveal from "@/components/animations/section-reveal"

export function WhyJoinUsSection() {
  return (
    <SectionReveal className="w-full bg-white py-12 md:py-20" yParallax={[10, -20]}>
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[36px] bg-emerald-900 text-white">
          {/* top subtle white border like in reference */}
          <div className="absolute left-0 right-0 top-0 h-[2px] bg-white/70" aria-hidden="true" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-8 md:p-12 lg:p-16">
              <h2 className="text-pretty text-3xl md:text-4xl font-semibold">Why Join Us?</h2>
              <p className="mt-4 text-white/80 leading-relaxed">
                Our platform transforms eco‑actions into engaging experiences—learn, participate, and earn while making
                a real‑world impact.
              </p>
            </div>
            <div className="relative min-h-[260px] md:min-h-[420px]">
              {/* neon ring accent behind the media */}
              <div
                className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 h-64 w-64 md:h-80 md:w-80 rounded-full border-8 border-emerald-400/70"
                aria-hidden="true"
              />
              <video
                className="absolute right-0 bottom-0 translate-y-6 md:translate-y-8 w-[68%] max-w-[420px] rounded-lg shadow-2xl"
                autoPlay
                muted
                loop
                playsInline
                poster="/why-join-us-video-placeholder.png"
              >
                <source src="/videos/why-join-us.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  )
}

export default WhyJoinUsSection
