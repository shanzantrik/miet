import { useState, useEffect } from 'react';

function HexCountdown() {
  // Example: static countdown for demo
  const [time, setTime] = useState({ days: 597, hours: 7, minutes: 56, seconds: 16 });
  // You can add real countdown logic if needed
  const items = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];
  return (
    <div className="flex gap-6 justify-center md:justify-start mb-8">
      {items.map((item, i) => (
        <div key={item.label} className="flex flex-col items-center">
          <div className="bg-blue-100 text-blue-700 font-extrabold text-3xl md:text-4xl px-8 py-6 rounded-2xl shadow mb-1 flex items-center justify-center" style={{ clipPath: 'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)' }}>
            {item.value}
          </div>
          <span className="text-blue-700 font-semibold">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function CTACountdown() {
  return (
    <section className="relative bg-gradient-to-r from-blue-50 via-white to-pink-50 py-16 px-4 md:px-0 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: Overlapping circular images and floating badges */}
        <div className="relative flex justify-center items-center min-h-[400px]">
          {/* Large circle image */}
          <div className="relative w-[340px] h-[340px]">
            <img
              src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
              alt="Instructor 1"
              className="w-[340px] h-[340px] object-cover rounded-full shadow-xl border-4 border-white"
            />
            {/* Instructor badge */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg px-6 py-3 flex items-center gap-3 border-2 border-gray-100 z-20">
              <span className="font-bold text-gray-900 mr-2">Instructor</span>
              <span className="flex -space-x-2">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-8 h-8 rounded-full border-2 border-white" alt="A" />
                <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-8 h-8 rounded-full border-2 border-white" alt="B" />
                <img src="https://randomuser.me/api/portraits/men/45.jpg" className="w-8 h-8 rounded-full border-2 border-white" alt="C" />
                <span className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-blue-900 font-bold border-2 border-white text-xs">+</span>
              </span>
              <span className="ml-2 text-blue-700 font-bold">150+</span>
              <span className="text-gray-500 text-xs">Instructor</span>
            </div>
            {/* Small circle image */}
            <img
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80"
              alt="Instructor 2"
              className="w-[180px] h-[180px] object-cover rounded-full shadow-lg border-4 border-white absolute -bottom-10 left-[-60px] z-10"
            />
            {/* AVG Reviews badge */}
            <div className="absolute bottom-8 right-[-40px] bg-white rounded-xl shadow-lg px-6 py-3 flex items-center gap-3 border-2 border-gray-100 z-20">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.77 7.82 20 9 12.91l-5-3.64 5.91-.91L12 2z" fill="currentColor" /></svg>
              </span>
              <div>
                <div className="font-bold text-gray-900">245+</div>
                <div className="text-gray-500 text-xs">AVG Reviews</div>
              </div>
            </div>
            {/* Decorative SVGs/arrows */}
            <svg className="absolute -left-24 top-24 w-24 h-24 text-blue-200" fill="none" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="currentColor" /></svg>
            <svg className="absolute -left-24 top-1/2 w-24 h-24 text-blue-400" fill="none" viewBox="0 0 100 100"><path d="M10,90 Q50,10 90,90" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
            <svg className="absolute right-0 top-0 w-16 h-16 text-purple-200" fill="none" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="currentColor" /></svg>
          </div>
        </div>
        {/* Right: CTA and countdown */}
        <div className="flex flex-col items-start justify-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 leading-tight mb-4">
            Join Us for a Free <span className="relative inline-block text-blue-700 animate-pulse">Special Education Webinar
              <span className="absolute left-0 bottom-0 w-full h-2 bg-blue-200 rounded-full -z-10 animate-underline" style={{ zIndex: -1 }}></span>
            </span> Today
          </h2>
          <HexCountdown />
          <a href="/signup" className="px-8 py-4 bg-blue-700 text-white font-bold rounded-full shadow hover:bg-blue-800 transition text-lg flex items-center gap-2 self-start">
            Sign Up Now
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </div>
      </div>
      <style jsx>{`
        .animate-underline {
          animation: underlineGrow 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes underlineGrow {
          0% { width: 0; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
}
