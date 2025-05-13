import { useState, useRef, useEffect } from 'react';

const categories = [
  'All', 'Business', 'Engineering', 'Data Science', 'Architecture', 'Psychology', 'Technology', 'Electricity', 'Accounting', 'Development',
];
const consultants = [
  {
    id: 1,
    name: 'Dr. Asha Mehta',
    title: 'Business',
    img: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=400&h=400&facepad=2&q=80',
    rating: 4.8,
    reviews: 21,
    tag: 'Accounting',
    lessons: 19,
    duration: '175Hours 40 Minutes',
  },
  {
    id: 2,
    name: 'Ms. Priya Singh',
    title: 'Development',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400&facepad=2&q=80',
    rating: 4.8,
    reviews: 18,
    tag: 'Development',
    lessons: 18,
    duration: '175Hours 40 Minutes',
  },
  {
    id: 3,
    name: 'Mr. Rajiv Kumar',
    title: 'Engineering',
    img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400&facepad=2&q=80',
    rating: 4.7,
    reviews: 15,
    tag: 'Engineering',
    lessons: 15,
    duration: '175Hours 40 Minutes',
  },
  {
    id: 4,
    name: 'Dr. Sunita Rao',
    title: 'Data Science',
    img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=400&facepad=2&q=80',
    rating: 4.9,
    reviews: 32,
    tag: 'Data Science',
    lessons: 20,
    duration: '175Hours 40 Minutes',
  },
  {
    id: 5,
    name: 'Mr. John Doe',
    title: 'Psychology',
    img: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=facearea&w=400&h=400&facepad=2&q=80',
    rating: 4.6,
    reviews: 12,
    tag: 'Psychology',
    lessons: 12,
    duration: '175Hours 40 Minutes',
  },
  {
    id: 6,
    name: 'Ms. Jane Smith',
    title: 'Technology',
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&h=400&facepad=2&q=80',
    rating: 4.7,
    reviews: 14,
    tag: 'Technology',
    lessons: 14,
    duration: '175Hours 40 Minutes',
  },
  {
    id: 7,
    name: 'Dr. Emily Clark',
    title: 'Electricity',
    img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=facearea&w=400&h=400&facepad=2&q=80',
    rating: 4.8,
    reviews: 16,
    tag: 'Electricity',
    lessons: 16,
    duration: '175Hours 40 Minutes',
  },
  {
    id: 8,
    name: 'Mr. Alex Turner',
    title: 'Architecture',
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 19,
    tag: 'Architecture',
    lessons: 19,
    duration: '175Hours 40 Minutes',
  },
];

export default function BrowseConsultantsSection() {
  const [selected, setSelected] = useState('All');
  const filtered = selected === 'All' ? consultants : consultants.filter(c => c.title === selected);

  // Slider state
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef();
  const intervalRef = useRef();
  const visibleCount = 3; // Number of cards visible at once (for desktop)

  // Autoplay effect
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % Math.max(filtered.length, 1));
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, [filtered.length]);

  // Arrow navigation
  const prevSlide = () => setCurrent(c => (c - 1 + filtered.length) % filtered.length);
  const nextSlide = () => setCurrent(c => (c + 1) % filtered.length);

  // Scroll filter bar on overflow
  const filterBarRef = useRef();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <span className="inline-block bg-red-100 text-red-600 font-bold px-4 py-1 rounded-full mb-3">Popular Consultants</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 leading-tight mb-2">
              Pick A Consultant <span className="relative inline-block text-blue-700 animate-pulse">To Get
                <span className="absolute left-0 bottom-0 w-full h-2 bg-blue-200 rounded-full -z-10 animate-underline" style={{ zIndex: -1 }}></span>
              </span> Started
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="text-blue-800 max-w-md text-base mb-2 md:mb-0">Discover your interests, enroll, and start learning with confidence today!</div>
            <a href="/courses" className="flex items-center gap-2 px-7 py-3 bg-blue-700 text-white font-bold rounded-full shadow hover:bg-blue-800 transition text-lg self-start md:self-auto animate-fade-in">
              Browse More
              <span className="inline-flex items-center justify-center w-8 h-8 bg-white text-blue-700 rounded-full ml-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </a>
          </div>
        </div>
        {/* Scrollable filter bar with arrows */}
        <div className="flex items-center gap-2 mb-8">
          <button
            className="rounded-full border border-blue-200 w-10 h-10 flex items-center justify-center text-blue-700 hover:bg-blue-50 transition"
            onClick={() => filterBarRef.current.scrollBy({ left: -120, behavior: 'smooth' })}
            aria-label="Scroll left"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="overflow-x-auto pb-2" ref={filterBarRef}>
            <div className="flex gap-3 min-w-max">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelected(cat); setCurrent(0); }}
                  className={`px-6 py-2 rounded-full font-semibold border transition whitespace-nowrap ${selected === cat ? 'bg-blue-700 text-white border-blue-700' : 'bg-gray-100 text-blue-900 border-gray-200 hover:bg-blue-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <button
            className="rounded-full border border-blue-200 w-10 h-10 flex items-center justify-center text-blue-700 hover:bg-blue-50 transition"
            onClick={() => filterBarRef.current.scrollBy({ left: 120, behavior: 'smooth' })}
            aria-label="Scroll right"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        {/* Slider with arrows and bullets */}
        <div className="relative">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-blue-200 rounded-full p-2 shadow hover:bg-blue-50 transition hidden sm:block"
            onClick={prevSlide}
            aria-label="Previous"
            style={{ left: '-2rem' }}
          >
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-700"
              style={{
                transform: `translateX(-${current * (100 / Math.min(filtered.length, visibleCount))}%)`,
                width: `${filtered.length * (100 / Math.min(filtered.length, visibleCount))}%`
              }}
            >
              {filtered.map((c, i) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition w-96 flex-shrink-0 p-0 relative mx-4 flex flex-col items-stretch group border border-blue-100"
                  style={{ minWidth: '370px', maxWidth: '370px' }}
                >
                  {/* Image with rating badge */}
                  <div className="relative rounded-t-2xl overflow-hidden h-56">
                    <img src={c.img} alt={c.name} className="object-cover w-full h-full" />
                    <span className="absolute top-3 left-3 bg-blue-700 text-white font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                      <svg className="h-4 w-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" /></svg>
                      {c.rating} ({c.reviews})
                    </span>
                    <span className="absolute bottom-3 right-3 bg-red-500 text-white font-bold px-4 py-1 rounded-full text-xs shadow">{c.tag}</span>
                  </div>
                  {/* Title and info */}
                  <div className="px-6 py-4 flex-1 flex flex-col justify-between">
                    <div className="font-bold text-lg text-blue-900 mb-2 group-hover:text-blue-700 transition leading-snug">{c.name}</div>
                    <div className="flex gap-6 items-center text-blue-700 text-sm font-semibold mb-2">
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" className="text-blue-200" /></svg>
                        {c.lessons} Lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" className="text-blue-200" /><path d="M12 6v6l4 2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {c.duration}
                      </span>
                    </div>
                    <button className="mt-2 px-5 py-2 bg-blue-700 text-white rounded-full font-bold shadow hover:bg-blue-800 transition flex items-center gap-2 self-start">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-blue-200 rounded-full p-2 shadow hover:bg-blue-50 transition hidden sm:block"
            onClick={nextSlide}
            aria-label="Next"
            style={{ right: '-2rem' }}
          >
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        {/* Bullets */}
        <div className="flex justify-center mt-4 gap-2">
          {filtered.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full ${i === current ? 'bg-blue-700' : 'bg-blue-200'} transition`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
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
