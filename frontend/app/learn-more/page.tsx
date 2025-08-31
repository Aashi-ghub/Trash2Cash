"use client"

import { Button } from "@/components/ui/button"
import { Recycle, Leaf, Globe, TrendingUp, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Recycle className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-emerald-900">Trash2Cash</span>
            </Link>
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Recycle className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-900 mb-6 leading-tight">
              Why Responsible Waste Management Matters
            </h1>
            <p className="text-xl text-emerald-700 leading-relaxed max-w-3xl mx-auto">
              Every year, the world generates over <span className="font-bold text-2xl text-emerald-800">2.24 billion tons</span> of solid waste — and according to the World Bank, this number will rise to <span className="font-bold text-2xl text-emerald-800">3.88 billion tons</span> by 2050. Shockingly, only <span className="font-bold text-2xl text-red-600">19%</span> is recycled, while the rest ends up in landfills or the environment.
            </p>
          </div>
        </div>
      </section>

      {/* Environmental Impact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Globe className="w-12 h-12 text-emerald-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Environmental Impact</h2>
          </div>
          
          <div className="space-y-8 text-lg leading-relaxed text-emerald-800">
            <p>
              Landfills release methane, a greenhouse gas <span className="font-bold text-2xl text-red-600">84x more potent</span> than CO₂ according to the IPCC. This contributes significantly to climate change and global warming, creating a vicious cycle of environmental degradation.
            </p>
            
            <div className="bg-emerald-50 rounded-2xl p-8 my-8 border-l-4 border-emerald-400">
              <p className="text-xl font-semibold text-emerald-900 mb-4">
                Plastic waste alone makes up <span className="font-bold text-3xl text-red-600">80%</span> of marine litter, killing over <span className="font-bold text-3xl text-red-600">100,000 marine animals</span> each year according to UNEP.
              </p>
            </div>
            
            <p>
              Improper disposal leads to soil contamination and polluted groundwater, directly impacting human health. The toxins from waste can seep into our water systems, affecting both wildlife and human populations for generations to come.
            </p>
          </div>
        </div>
      </section>

      {/* Economic Cost Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-emerald-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <TrendingUp className="w-12 h-12 text-emerald-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Economic Cost</h2>
          </div>
          
          <div className="space-y-8 text-lg leading-relaxed text-emerald-800">
            <p>
              Countries collectively spend <span className="font-bold text-2xl text-emerald-800">$205 billion annually</span> on waste management, yet inefficiencies persist according to the World Bank. This massive expenditure often goes towards outdated and unsustainable practices that fail to address the root causes of waste generation.
            </p>
            
            <div className="bg-white rounded-2xl p-8 my-8 border-l-4 border-emerald-400 shadow-lg">
              <p className="text-xl font-semibold text-emerald-900 mb-4">
                At the same time, recycling and circular economy initiatives could unlock <span className="font-bold text-3xl text-emerald-800">$4.5 trillion</span> in global economic benefits by 2030 according to Accenture.
              </p>
            </div>
            
            <p>
              This represents a massive opportunity for economic transformation. By shifting from a linear "take-make-dispose" model to a circular economy, we can create sustainable economic growth while protecting our planet and its resources for future generations.
            </p>
          </div>
        </div>
      </section>

      {/* Social Impact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Users className="w-12 h-12 text-emerald-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Social Impact</h2>
          </div>
          
          <div className="space-y-8 text-lg leading-relaxed text-emerald-800">
            <p>
              In many regions, waste pickers work in unsafe conditions with minimal pay, often risking their health and safety to collect recyclable materials. These workers are the unsung heroes of waste management, yet they receive little recognition or fair compensation for their crucial role in environmental protection.
            </p>
            
            <p>
              Incentivized recycling systems create fairer, safer, and more rewarding opportunities for communities. By providing proper infrastructure, training, and fair compensation, we can transform waste management from a burden into an economic opportunity that benefits everyone involved in the process.
            </p>
          </div>
        </div>
      </section>

      {/* How Trash2Cash Helps Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-emerald-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Leaf className="w-12 h-12 text-emerald-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">How Trash2Cash Helps</h2>
          </div>
          
          <div className="space-y-8 text-lg leading-relaxed text-emerald-800">
            <p>
              Trash2Cash bridges the gap by turning waste into rewards, creating a win-win solution for individuals, businesses, and communities. Our innovative platform transforms the traditional waste management paradigm into an engaging, rewarding experience.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 my-12">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">For Users</h3>
                <p className="text-emerald-700">Scan, recycle, and earn cashback or discounts while contributing to environmental protection.</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">For Businesses</h3>
                <p className="text-emerald-700">Save costs while boosting sustainability credentials and engaging with environmentally conscious customers.</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">For Communities</h3>
                <p className="text-emerald-700">Benefit from reduced pollution and increased awareness, creating healthier living environments.</p>
              </div>
            </div>
            
            <p>
              By gamifying the recycling process, we make sustainability accessible, enjoyable, and rewarding for everyone. Our platform demonstrates that environmental responsibility doesn't have to be a sacrifice—it can be a source of pride, community, and tangible benefits.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Recycle className="w-20 h-20 text-emerald-300 mx-auto mb-8" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            When recycling becomes rewarding, sustainability becomes second nature.
          </h2>
          <p className="text-xl text-emerald-200 mb-8 leading-relaxed">
            Join Trash2Cash in creating a world where environmental responsibility is not just a choice, but a natural part of everyday life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg font-semibold">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-emerald-300 text-emerald-300 hover:bg-emerald-800 px-8 py-3 text-lg font-semibold">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
