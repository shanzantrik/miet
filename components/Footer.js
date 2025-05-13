import { useEffect, useState } from 'react';

export default function Footer() {
  // Scroll-to-top button logic
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer className="relative bg-[#11131a] text-white pt-24 pb-10 mt-12" style={{ backgroundImage: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.01) 0 2px,transparent 2px 40px)' }}>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* About/Brand */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-8 w-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
            <span className="font-extrabold text-2xl tracking-tight">MieT</span>
          </div>
          <div className="text-gray-300 text-sm leading-relaxed">Empowering Every Unique Mind.<br />Join us to unlock your potential and connect with top consultants and resources.</div>
          <div className="flex gap-2 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook" className="p-2 rounded-lg bg-[#181a23] hover:bg-blue-600 transition"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z" /></svg></a>
            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" className="p-2 rounded-lg bg-[#181a23] hover:bg-pink-600 transition"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a6.25 6.25 0 1 1-6.25 6.25A6.25 6.25 0 0 1 12 5.75zm0 1.5a4.75 4.75 0 1 0 4.75 4.75A4.75 4.75 0 0 0 12 7.25zm6.5 1.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" /></svg></a>
            <a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter" className="p-2 rounded-lg bg-[#181a23] hover:bg-blue-400 transition"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.1.99C7.69 8.99 4.07 7.13 1.64 4.15c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.94 3.62-.72-.02-1.4-.22-1.99-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.11 2.9 3.97 2.93A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.72 8.72 0 0 0 24 4.59a8.5 8.5 0 0 1-2.54.7z" /></svg></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn" className="p-2 rounded-lg bg-[#181a23] hover:bg-blue-700 transition"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.38v4.59h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" /></svg></a>
          </div>
        </div>
        {/* Utility Pages */}
        <div className="col-span-1">
          <div className="font-bold text-lg mb-3">Pages</div>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/about" className="hover:text-yellow-400 transition">About</a></li>
            <li><a href="/consultants" className="hover:text-yellow-400 transition">Consultants</a></li>
            <li><a href="/products" className="hover:text-yellow-400 transition">Products</a></li>
            <li><a href="/faq" className="hover:text-yellow-400 transition">FAQ</a></li>
            <li><a href="/contact" className="hover:text-yellow-400 transition">Contact</a></li>
          </ul>
        </div>
        {/* Contact Info */}
        <div className="col-span-1">
          <div className="font-bold text-lg mb-3">Contact Us</div>
          <div className="text-gray-300 text-sm mb-2">Email: <a href="mailto:info@miet.com" className="hover:text-yellow-400">info@miet.com</a></div>
          <div className="text-gray-300 text-sm mb-2">Phone: <a href="tel:+1234567890" className="hover:text-yellow-400">+1 234 567 890</a></div>
          <div className="text-gray-300 text-sm">Location: 123 Main St, Your City, Country</div>
        </div>
        {/* Anytime Connect Card */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="bg-[#181a23] rounded-full p-1 shadow-lg mb-4">
            <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-blue-600 relative">
              <a href="/contact" className="absolute inset-0 flex flex-col items-center justify-center group">
                <svg className="h-8 w-8 text-blue-400 group-hover:text-yellow-400 transition mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="font-bold text-lg group-hover:text-yellow-400 transition">Contact Us</span>
              </a>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="font-bold text-white text-lg">Anytime Connect<br />With Us</div>
            <div className="text-yellow-400 font-bold text-md mt-2">07:00 AM - 12:30 PM</div>
            <div className="text-gray-400 text-xs">Saturday - Thursday</div>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} MieT. All rights reserved.
      </div>
      {/* Scroll to top button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full shadow-lg transition flex items-center justify-center animate-bounce"
          aria-label="Scroll to top"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      )}
    </footer>
  );
}
