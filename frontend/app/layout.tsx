import type React from "react"
import type { Metadata } from "next"
import { AuthProvider } from "@/components/auth-provider"
import { UserPointsProvider } from "@/lib/contexts/UserPointsContext"
import "./globals.css"

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
    <html lang="en" className="antialiased">
      <body className="font-sans" suppressHydrationWarning={true}>
        <AuthProvider>
          <UserPointsProvider>
            {children}
          </UserPointsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
