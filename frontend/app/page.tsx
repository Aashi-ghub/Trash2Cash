"use client"

import { Button } from "@/components/ui/button"
import { Recycle, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import WhyChooseSection from "@/components/sections/why-choose"
import WhyJoinUsSection from "@/components/sections/why-join-us"
import UnlockPotentialSection from "@/components/sections/unlock-potential"
import ExploreImpactSection from "@/components/sections/explore-impact"
import GetInvolvedSection from "@/components/sections/get-involved"
import ClientEcoHero from "@/components/client-eco-hero"
import HomeLayout from "./home-layout"
import { useAuth } from "@/components/auth-provider"
import RoleBasedDashboard from "@/components/role-based-dashboard"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [authError, setAuthError] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <HomeLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-950 mx-auto mb-4"></div>
            <p className="text-emerald-950">Loading...</p>
          </div>
        </div>
      </HomeLayout>
    )
  }

  // Show the landing page for all users (including logged-in users)
  return (
    <HomeLayout>
      <div className="min-h-screen">
      {/* Navigation */}
      <nav 
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
          isScrolled ? 'mx-auto max-w-4xl rounded-full' : ''
        }`}
        style={{
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          background: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'none',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-emerald-950 rounded-lg flex items-center justify-center">
                <Recycle className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">Trash2Cash</span>
            </Link>
                          <div className="hidden md:flex items-center gap-6 font-dosis">
                <Link href="#hero" className="text-white hover:text-green-300 font-medium font-dosis">
                  Home
                </Link>
                <Link href="#why-join-us" className="text-white hover:text-green-300 font-medium font-dosis">
                  About
                </Link>
                <Link href="#why-choose" className="text-white hover:text-green-300 font-medium font-dosis">
                  Features
                </Link>
                <Link href="#footer" className="text-white hover:text-green-300 font-medium font-dosis">
                  Contact
                </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-white hover:text-green-300 font-medium font-dosis">
                    Dashboard
                  </Link>
                  <Button 
                    onClick={() => {
                      localStorage.removeItem('trash2cash_token')
                      localStorage.removeItem('trash2cash_user')
                      window.location.href = '/'
                    }}
                    className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-medium font-dosis"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-medium font-dosis">
                    Join Now
                  </Button>
                </Link>
              )}
            </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
            
                        {/* Mobile menu */}
              {mobileMenuOpen && (
                <div 
                  className={`md:hidden border-t transition-all duration-300 ${
                    isScrolled 
                      ? 'border-white/20 rounded-b-full' 
                      : 'border-white/10'
                  }`}
                  style={{
                    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(12px)' : 'none'
                  }}
                >
                                <div className="px-2 pt-2 pb-3 space-y-1 font-dosis">
                  <Link href="#hero" className="block px-3 py-2 text-white hover:text-green-300 font-medium font-dosis">
                    Home
                  </Link>
                  <Link href="#why-join-us" className="block px-3 py-2 text-white hover:text-green-300 font-medium font-dosis">
                    About
                  </Link>
                  <Link href="#why-choose" className="block px-3 py-2 text-white hover:text-green-300 font-medium font-dosis">
                    Features
                  </Link>
                  <Link href="#footer" className="block px-3 py-2 text-white hover:text-green-300 font-medium font-dosis">
                    Contact
                  </Link>
                  {user ? (
                    <>
                      <Link href="/dashboard" className="block px-3 py-2 text-white hover:text-green-300 font-medium font-dosis">
                        Dashboard
                      </Link>
                      <Button 
                        onClick={() => {
                          localStorage.removeItem('trash2cash_token')
                          localStorage.removeItem('trash2cash_user')
                          window.location.href = '/'
                        }}
                        className="w-full bg-white hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-medium font-dosis"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link href="/login" className="block px-3 py-2">
                      <Button className="w-full bg-white hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-medium font-dosis">
                        Join Now
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div id="hero" className="relative min-h-screen flex items-start justify-start overflow-hidden">
          {/* Background Video */}
          <div className="absolute inset-0">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.7)' }}
              ref={(el) => {
                if (el) el.playbackRate = 1;
              }}
            >
              <source src="/Waste_to_Reward_Animation_Generated.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Hero Content - Left Aligned */}
          <div className="relative z-10 text-left text-white px-16 pt-32 max-w-2xl font-dosis">
            <h1 className="text-xl md:text-xl font-bold mb-4 font-dosis" style={{ color: '#ACE1AF' }}>
              Eco-Friendly Adventures
            </h1>
            <h2 className="text-4xl md:text-5xl  mb-6 font-bungee" >
              Discover Your Sustainable
            </h2>
            <p className="text-lg md:text-xl mb-8 font-dosis" style={{ color: '#455b5' }}>
              Welcome to our platform that gamifies eco-friendly actions
            </p>
                          <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link href="/dashboard">
                    <Button className="bg-emerald-950 hover:bg-emerald-900 text-white px-8 py-3 rounded-lg text-lg font-semibold font-dosis">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/signup">
                    <Button className="bg-emerald-950 hover:bg-emerald-900 text-white px-8 py-3 rounded-lg text-lg font-semibold font-dosis">
                      Start Your Journey
                    </Button>
                  </Link>
                )}
                <Link href="/learn-more">
                  <Button variant="outline" className="border-emerald-950 text-emerald-950 hover:bg-emerald-950 hover:text-white px-8 py-3 rounded-lg text-lg font-semibold font-dosis">
                    Learn More
                  </Button>
                </Link>
              </div>
          </div>

          
        </div>

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
      </HomeLayout>
    )
}
