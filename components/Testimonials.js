import { useState } from 'react';

const testimonials = [
  {
    name: 'Aarav’s Parent',
    role: 'Parent',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: "MieT helped my child gain confidence and thrive in school. The consultants are caring and professional. The interactive lessons kept my child engaged and motivated.",
    rating: 5,
    twitter: '#',
  },
  {
    name: 'Ms. Sharma',
    role: 'Special Educator',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    text: "The resources and training from MieT have transformed my classroom. The platform is easy to use, and the support team is always available. Highly recommended!",
    rating: 5,
    twitter: '#',
  },
  {
    name: 'Rahul',
    role: 'Student',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: "I love the learning app and the support I get from my therapist. The courses are affordable, and the value I get from the certifications is priceless. Thank you, MieT!",
    rating: 5,
    twitter: '#',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const visibleCount = 2;

  const prev = () => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(c => (c + 1) % testimonials.length);

  return (
    <section className="my-16 max-w-7xl mx-auto px-4 relative overflow-hidden">
      {/* Title and right description */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <span className="inline-block bg-red-100 text-red-600 font-bold px-4 py-1 rounded-full mb-3">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 leading-tight mb-2">
            What Users <span className="relative inline-block text-blue-700 animate-pulse">Saying
              <span className="absolute left-0 bottom-0 w-full h-2 bg-blue-200 rounded-full -z-10 animate-underline" style={{ zIndex: -1 }}></span>
            </span> About EduZen
          </h2>
        </div>
        <div className="flex flex-col items-start md:items-end gap-3">
          <div className="text-blue-800 max-w-md text-base mb-2 md:mb-0">Discover your interests, enroll, and start learning with confidence today!</div>
          <div className="flex gap-2">
            <button onClick={prev} className="rounded-full border border-blue-400 w-10 h-10 flex items-center justify-center text-blue-700 hover:bg-blue-50 transition" aria-label="Previous">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={next} className="rounded-full border border-blue-400 w-10 h-10 flex items-center justify-center text-blue-700 hover:bg-blue-50 transition" aria-label="Next">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>
      {/* Testimonial cards */}
      <div className="flex flex-wrap gap-8 justify-center md:justify-start">
        {Array.from({ length: visibleCount }).map((_, idx) => {
          const t = testimonials[(current + idx) % testimonials.length];
          return (
            <div key={t.name} className="relative bg-blue-50 rounded-2xl shadow-lg p-8 max-w-xl flex-1 min-w-[320px] flex flex-col justify-between">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" /></svg>
                ))}
              </div>
              {/* Quote shape */}
              <div className="relative mb-6">
                <svg className="absolute -left-6 -top-6 h-12 w-12 text-blue-100" fill="none" viewBox="0 0 48 48"><path d="M16 44c0-8 8-8 8-8s8 0 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                <p className="text-blue-900 text-lg leading-relaxed">{t.text}</p>
              </div>
              {/* User info */}
              <div className="flex items-center gap-4 mt-4">
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full border-2 border-blue-200 object-cover" />
                <div>
                  <div className="font-bold text-lg text-blue-900">{t.name}</div>
                  <div className="text-blue-700 text-sm">{t.role}</div>
                </div>
                <span className="mx-4 h-8 border-l border-blue-200"></span>
                <a href={t.twitter} className="ml-auto text-blue-400 hover:text-blue-600" aria-label="Twitter">
                  <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.1.99C7.69 8.99 4.07 7.13 1.64 4.15c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.94 3.62-.72-.02-1.4-.22-1.99-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.11 2.9 3.97 2.93A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.72 8.72 0 0 0 24 4.59a8.5 8.5 0 0 1-2.54.7z" /></svg>
                </a>
              </div>
            </div>
          );
        })}
      </div>
      {/* Bullets */}
      <div className="flex justify-center mt-8 gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full ${i === current ? 'bg-blue-600' : 'bg-blue-200'} transition`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
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
