import type React from "react"
import type { Metadata } from "next"
import { Dosis, Exo_2, Bungee } from "next/font/google"
import { AuthProvider } from "@/components/auth-provider"
import "./globals.css"

const dosis = Dosis({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-dosis",
})

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-exo2",
})

const bungee = Bungee({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-bungee",
})

export const metadata: Metadata = {
  title: "Trash2Cash - Turn Waste into Rewards",
  description: "Join the sustainable revolution. Earn rewards for proper waste disposal and recycling.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dosis.variable} ${exo2.variable} ${bungee.variable} antialiased`}>
      <body className="font-dosis">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
