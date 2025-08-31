import Link from "next/link"

export function GetInvolvedSection() {
  return (
    <footer id="footer" className="w-full bg-emerald-950 text-white pt-16 md:pt-24 font-dosis">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-pretty text-3xl md:text-4xl font-semibold font-bungee">Get Involved</h2>
          <p className="mt-3 text-white/70 max-w-2xl mx-auto font-dosis">
            Take the first step and join our community of eco‑warriors. Participate in our challenges, earn rewards.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 py-10">
          <div className="font-dosis">
            <Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-emerald-950 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-bold text-xl text-white">Trash2Cash</span>
            </Link>
            <p className="text-sm text-white/60 font-dosis">© {new Date().getFullYear()} Trash2Cash. All rights reserved.</p>
          </div>
          <div className="font-dosis">
            <h3 className="font-semibold mb-3 font-dosis">Quick Links</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="/" className="hover:text-white font-dosis">
                  Home
                </a>
              </li>
              <li>
                <a href="/mission" className="hover:text-white font-dosis">
                  About
                </a>
              </li>
              <li>
                <a href="/rewards" className="hover:text-white font-dosis">
                  Features
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white font-dosis">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="font-dosis">
            <h3 className="font-semibold mb-3 font-dosis">Follow Us</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="#" className="hover:text-white font-dosis">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white font-dosis">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white font-dosis">
                  YouTube
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white font-dosis">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default GetInvolvedSection
