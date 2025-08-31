"use client"

import dynamic from "next/dynamic"

const EcoHero = dynamic(() => import("@/components/3d/eco-hero"), { ssr: false })

export default function ClientEcoHero() {
  return <EcoHero />
}

