import { Button } from "@/components/ui/button"
import { Recycle } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import WhyChooseSection from "@/components/sections/why-choose"
import WhyJoinUsSection from "@/components/sections/why-join-us"
import UnlockPotentialSection from "@/components/sections/unlock-potential"
import ExploreImpactSection from "@/components/sections/explore-impact"
import GetInvolvedSection from "@/components/sections/get-involved"

const EcoHero = dynamic(() => import("@/components/3d/eco-hero"), { ssr: false })

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Recycle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-xl text-foreground">Trash2Cash</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <EcoHero />

      {/* About Our Mission (Why Choose Trash2Cash) */}
      <WhyChooseSection />

      {/* Why Join Us */}
      <WhyJoinUsSection />

      {/* Unlock Your Sustainable Potential */}
      <UnlockPotentialSection />

      {/* Explore Our Impact */}
      <ExploreImpactSection />

      {/* Get Involved Footer */}
      <GetInvolvedSection />
    </div>
  )
}
