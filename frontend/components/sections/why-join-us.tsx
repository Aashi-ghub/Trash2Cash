"use client"

export function WhyJoinUsSection() {
  return (
    <section id="why-join-us" className="w-full bg-white py-12 md:py-20 pb-8 md:pb-8 font-dosis">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        {/* Green top section (1/4th) with rounded borders */}
        <div className="relative overflow-hidden rounded-[36px] bg-emerald-900 text-white h-64 md:h-96">
          {/* top subtle white border like in reference */}
          <div className="absolute left-0 right-0 top-0 h-[2px] bg-white/70" aria-hidden="true" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center font-dosis">
              <h2 className="text-pretty text-3xl md:text-4xl font-semibold font-bungee">Why Join Us?</h2>
              <p className="mt-4 text-white/80 leading-relaxed font-dosis">
                Our platform is more than just a game - it's a transformative experience that empowers you to become a catalyst for positive change. By participating in our gamified eco-friendly challenges, you'll not only learn valuable lessons but also
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              {/* neon ring accent behind the media */}
              <div
                className="absolute right-6 md:right-12 h-64 w-64 md:h-80 md:w-80 rounded-full border-8 border-emerald-400/70"
                aria-hidden="true"
              />
              {/* Placeholder Video */}
              <div className="relative w-[68%] max-w-[420px]">
                <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-48 md:h-64 object-cover"
                  >
                    
                    <source src="/Futuristic_Eco_Tech_App_Animation.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[12px] border-l-emerald-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* White bottom section (3/4th) */}
        <div className="bg-white rounded-b-[36px] -mt-8 md:-mt-12 pt-8 md:pt-12 pb-8 md:pb-16">
          {/* Additional content can go here */}
        </div>
      </div>
    </section>
  )
}

export default WhyJoinUsSection
