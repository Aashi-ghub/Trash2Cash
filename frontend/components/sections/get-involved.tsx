export function GetInvolvedSection() {
  return (
    <footer className="w-full bg-emerald-950 text-white pt-16 md:pt-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-pretty text-3xl md:text-4xl font-semibold">Get Involved</h2>
          <p className="mt-3 text-white/70 max-w-2xl mx-auto">
            Take the first step and join our community of eco‑warriors. Participate in our challenges, earn rewards.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 py-10">
          <div>
            <div className="h-10 w-10 bg-white/10 rounded-md mb-4" aria-hidden="true" />
            <p className="text-sm text-white/60">© {new Date().getFullYear()} Trash2Cash. All rights reserved.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="/" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/mission" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="/rewards" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Follow Us</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="#" className="hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  YouTube
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
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
