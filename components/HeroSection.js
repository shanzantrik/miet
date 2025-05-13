import { useRef } from 'react';

export default function HeroSection() {
  // Parallax/tilt effect for hero images
  const imageContainerRef = useRef(null);

  const handleMouseMove = (e) => {
    const container = imageContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxTilt = 15;
    const tiltX = (y / (rect.height / 2)) * maxTilt;
    const tiltY = -(x / (rect.width / 2)) * maxTilt;
    container.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  };
  const handleMouseLeave = () => {
    if (imageContainerRef.current) {
      imageContainerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-16 md:py-24 overflow-hidden">
      {/* Animated SVG background elements */}
      <svg className="absolute left-0 top-0 w-40 h-40 text-blue-100 animate-bounce-slow z-0" fill="none" viewBox="0 0 160 160"><circle cx="80" cy="80" r="80" fill="currentColor" /></svg>
      <svg className="absolute right-0 top-20 w-24 h-24 text-yellow-100 animate-spin-slow z-0" fill="none" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="currentColor" /></svg>
      <svg className="absolute left-1/2 bottom-0 w-32 h-32 text-blue-50 animate-float z-0" fill="none" viewBox="0 0 128 128"><polygon points="64,0 128,128 0,128" fill="currentColor" /></svg>
      {/* Extra animated sparkles */}
      <svg className="absolute left-1/4 top-1/3 w-8 h-8 text-yellow-300 animate-sparkle" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="currentColor" opacity="0.5" /></svg>
      <svg className="absolute right-1/3 bottom-1/4 w-6 h-6 text-blue-300 animate-sparkle-delayed" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.4" /></svg>
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-blue-100/30 via-transparent to-yellow-100/30 z-0" />
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6 relative z-10">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-blue-900 leading-tight animate-hero-fade">
            Empowering Every{' '}
            <span className="relative inline-block">
              <span className="bg-yellow-300 px-2 rounded rotate-2 inline-block animate-highlight">Unique Mind</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-yellow-400" viewBox="0 0 120 12" fill="none"><path d="M2 10 Q60 2 118 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
            </span>
          </h1>
          <p className="mb-8 text-lg md:text-2xl text-blue-800 max-w-xl animate-hero-fade delay-150">Specialized education, mental health, and technology for all children. Discover expert consultants, resources, and a supportive community.</p>
          <div className="flex flex-col sm:flex-row gap-4 animate-hero-fade delay-300">
            <a href="/consultants" className="px-8 py-3 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition-all text-lg hover:scale-105 focus:ring-4 focus:ring-yellow-200 animate-cta-bounce">Find a Consultant</a>
            <a href="/about" className="px-8 py-3 bg-blue-900 text-white font-bold rounded-full shadow-lg hover:bg-blue-800 transition-all text-lg hover:scale-105 focus:ring-4 focus:ring-blue-200 animate-cta-bounce delay-150">Learn More</a>
          </div>
        </div>
        <div
          className="relative flex justify-center md:justify-end items-center min-h-[340px] perspective-1000"
          ref={imageContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Overlapping images with parallax/tilt */}
          <img
            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80"
            alt="Hero visual 1"
            className="w-64 h-80 object-cover rounded-3xl shadow-2xl border-4 border-yellow-100 relative z-20 animate-float"
            style={{ top: '0', left: '0' }}
          />
          <img
            src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80"
            alt="Hero visual 2"
            className="w-48 h-64 object-cover rounded-3xl shadow-2xl border-4 border-blue-100 absolute z-10 animate-float-delayed"
            style={{ top: '60px', left: '120px' }}
          />
        </div>
      </div>
      {/* Stats/info bar with animated entrance */}
      <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 bg-blue-50 rounded-2xl shadow p-8 relative z-20 animate-stats-fade">
        <div className="flex flex-col items-center text-center group">
          <div className="flex items-center justify-center mb-2">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-200 group-hover:scale-110 transition-transform shadow-lg animate-pop-in">
              <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm1 4h-2v6h2V10z" fill="currentColor" /></svg>
            </span>
          </div>
          <div className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-1 animate-pulse">25+</div>
          <div className="text-blue-800 font-semibold text-lg">Years Experience</div>
        </div>
        <div className="flex flex-col items-center text-center group">
          <div className="flex items-center justify-center mb-2">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-200 group-hover:scale-110 transition-transform shadow-lg animate-pop-in delay-150">
              <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" /></svg>
            </span>
          </div>
          <div className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-1 animate-pulse" style={{ animationDelay: '0.2s' }}>450+</div>
          <div className="text-blue-800 font-semibold text-lg">Our Students</div>
        </div>
        <div className="flex flex-col items-center text-center group">
          <div className="flex items-center justify-center mb-2">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-200 group-hover:scale-110 transition-transform shadow-lg animate-pop-in delay-300">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8" rx="4" fill="currentColor" /></svg>
            </span>
          </div>
          <div className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-1 animate-pulse" style={{ animationDelay: '0.4s' }}>70+</div>
          <div className="text-blue-800 font-semibold text-lg">Popular Courses</div>
        </div>
      </div>
      <style jsx>{`
        .animate-bounce-slow {
          animation: bounce 4s infinite alternate;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite alternate;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite alternate;
          animation-delay: 2s;
        }
        .animate-sparkle {
          animation: sparkle 2.5s infinite alternate;
        }
        .animate-sparkle-delayed {
          animation: sparkle 2.5s infinite alternate;
          animation-delay: 1.2s;
        }
        .animate-hero-fade {
          opacity: 0;
          transform: translateY(30px);
          animation: heroFadeIn 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .animate-hero-fade.delay-150 {
          animation-delay: 0.15s;
        }
        .animate-hero-fade.delay-300 {
          animation-delay: 0.3s;
        }
        .animate-highlight {
          animation: highlight 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .animate-cta-bounce {
          animation: ctaBounce 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .animate-cta-bounce.delay-150 {
          animation-delay: 0.15s;
        }
        .animate-stats-fade {
          opacity: 0;
          transform: translateY(40px);
          animation: statsFadeIn 1.2s 0.5s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .animate-pop-in {
          opacity: 0;
          transform: scale(0.7);
          animation: popIn 0.8s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .animate-pop-in.delay-150 {
          animation-delay: 0.15s;
        }
        .animate-pop-in.delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(30px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-20px); }
        }
        @keyframes sparkle {
          0% { opacity: 0.7; transform: scale(1) rotate(0deg); }
          100% { opacity: 1; transform: scale(1.3) rotate(20deg); }
        }
        @keyframes heroFadeIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes highlight {
          0% { background: #fde047; }
          100% { background: #facc15; }
        }
        @keyframes ctaBounce {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes statsFadeIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          to { opacity: 1; transform: scale(1); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
