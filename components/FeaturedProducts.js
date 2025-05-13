import { useState, useRef, useEffect } from 'react';

const products = [
  {
    id: 1,
    name: 'Introduction to Coding: Learn Python Today',
    description: 'Learn Python from scratch with hands-on projects.',
    price: 1145,
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    lessons: 14,
    duration: '175Hours 40 Minutes',
    author: 'Esther Howard',
    authorImg: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    tags: ['Business', 'Finance'],
  },
  {
    id: 2,
    name: 'Business Management Strategies for Success',
    description: 'Master business management with real-world case studies.',
    price: 1145,
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    lessons: 14,
    duration: '175Hours 40 Minutes',
    author: 'Bessie Cooper',
    authorImg: 'https://randomuser.me/api/portraits/men/44.jpg',
    rating: 4.8,
    tags: ['Business'],
  },
  {
    id: 3,
    name: 'Introduction to Coding: Learn Python Today',
    description: 'Learn Python from scratch with hands-on projects.',
    price: 1145,
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    lessons: 14,
    duration: '175Hours 40 Minutes',
    author: 'Esther Howard',
    authorImg: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    tags: ['Business', 'Finance'],
  },
  {
    id: 4,
    name: 'Introduction to Coding: Learn Python Today',
    description: 'Learn Python from scratch with hands-on projects.',
    price: 1145,
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    lessons: 14,
    duration: '175Hours 40 Minutes',
    author: 'Esther Howard',
    authorImg: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    tags: ['Business', 'Finance'],
  },
  {
    id: 5,
    name: 'Introduction to Coding: Learn Python Today',
    description: 'Learn Python from scratch with hands-on projects.',
    price: 1145,
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    lessons: 14,
    duration: '175Hours 40 Minutes',
    author: 'Esther Howard',
    authorImg: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    tags: ['Business', 'Finance'],
  },
  {
    id: 6,
    name: 'Introduction to Coding: Learn Python Today',
    description: 'Learn Python from scratch with hands-on projects.',
    price: 1145,
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    lessons: 14,
    duration: '175Hours 40 Minutes',
    author: 'Esther Howard',
    authorImg: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    tags: ['Business', 'Finance'],
  },
];

export default function FeaturedProducts() {
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef();
  const intervalRef = useRef();
  const visibleCount = 3;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % Math.max(products.length, 1));
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const prevSlide = () => setCurrent(c => (c - 1 + products.length) % products.length);
  const nextSlide = () => setCurrent(c => (c + 1) % products.length);

  return (
    <section className="my-16 max-w-7xl mx-auto px-4">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 leading-tight mb-2">
            Top Enrolled{' '}
            <span className="relative inline-block text-blue-700 animate-pulse">
              Courses
              <span className="absolute left-0 bottom-0 w-full h-2 bg-blue-200 rounded-full -z-10 animate-underline" style={{ zIndex: -1 }}></span>
            </span>
            <br />This Month
          </h2>
        </div>
        <a href="/products" className="flex items-center gap-2 px-7 py-3 bg-blue-700 text-white font-bold rounded-full shadow hover:bg-blue-800 transition text-lg self-start md:self-auto animate-fade-in">
          Browse More
          <span className="inline-flex items-center justify-center w-8 h-8 bg-white text-blue-700 rounded-full ml-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </a>
      </div>
      {/* Slider */}
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
              transform: `translateX(-${current * (100 / Math.min(products.length, visibleCount))}%)`,
              width: `${products.length * (100 / Math.min(products.length, visibleCount))}%`
            }}
          >
            {products.map((p, i) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition w-[370px] flex-shrink-0 p-0 relative mx-4 flex flex-col items-stretch group border border-blue-100"
                style={{ minWidth: '370px', maxWidth: '370px' }}
              >
                {/* Image with badges */}
                <div className="relative rounded-t-2xl overflow-hidden h-56">
                  <img src={p.img} alt={p.name} className="object-cover w-full h-full" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {p.tags.map(tag => (
                      <span key={tag} className="bg-white/90 text-blue-900 font-semibold px-3 py-1 rounded-full text-xs shadow border border-blue-100">{tag}</span>
                    ))}
                  </div>
                </div>
                {/* Lessons and duration */}
                <div className="flex gap-6 px-6 py-3 items-center border-b border-blue-50">
                  <span className="flex items-center gap-1 text-blue-700 text-sm font-semibold">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" className="text-blue-200" /></svg>
                    {p.lessons} Lessons
                  </span>
                  <span className="flex items-center gap-1 text-blue-700 text-sm font-semibold">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" className="text-blue-200" /><path d="M12 6v6l4 2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {p.duration}
                  </span>
                </div>
                {/* Title and author */}
                <div className="px-6 py-4 flex-1 flex flex-col justify-between">
                  <div className="font-bold text-lg text-blue-900 mb-2 group-hover:text-blue-700 transition leading-snug">{p.name}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <img src={p.authorImg} alt={p.author} className="w-8 h-8 rounded-full border-2 border-blue-100" />
                    <span className="text-sm text-blue-700">Posted By</span>
                    <span className="font-semibold text-blue-900">{p.author}</span>
                    <button className="ml-auto p-2 rounded-full border border-blue-100 hover:bg-blue-50 transition">
                      <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.36 16 21 16 21H12Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  </div>
                </div>
                {/* Price, rating */}
                <div className="flex items-center justify-between px-6 py-3 bg-blue-50 rounded-b-2xl">
                  <div className="font-extrabold text-lg text-blue-900">${p.price.toFixed(2)}</div>
                  <div className="flex items-center gap-1 text-blue-700 font-semibold">
                    {p.rating}
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" /></svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" /></svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" /></svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" /></svg>
                    <svg className="h-5 w-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" /></svg>
                  </div>
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
        {products.map((_, i) => (
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
