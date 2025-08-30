import { WhyChooseSection } from "@/components/sections/why-choose"
import { WhyJoinUsSection } from "@/components/sections/why-join-us"
import { UnlockPotentialSection } from "@/components/sections/unlock-potential"
import { ExploreImpactSection } from "@/components/sections/explore-impact"
import { GetInvolvedSection } from "@/components/sections/get-involved"

export const metadata = {
  title: "Mission • Trash2Cash",
  description:
    "Why Choose Trash2Cash, Why Join Us, Unlock Your Sustainable Potential, Explore Our Impact, and Get Involved.",
}

export default function MissionPage() {
  return (
    <main className="w-full">
      {/* Section 1: Why Choose Trash2Cash (mission grid) */}
      <WhyChooseSection />
      {/* Section 2: Why Join Us (half green/white with ring) */}
      <WhyJoinUsSection />
      {/* Section 3: Unlock Your Sustainable Potential (white) */}
      <UnlockPotentialSection />
      {/* Section 4: Explore Our Impact (deep green) */}
      <ExploreImpactSection />
      {/* Section 5: Get Involved (footer-like) */}
      <GetInvolvedSection />
    </main>
  )
}
