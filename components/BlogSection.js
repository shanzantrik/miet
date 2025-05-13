const blogs = [
  {
    id: 1,
    title: '5 Tips to Make the Most of Online Learning',
    description: 'Discover practical advice to online education, from time management to maximizing interactive sessions.',
    tag: 'Science',
    date: '15 Nov, 2024',
    comments: 'Comment_02',
    img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'How to Stay During an Online Course Learning',
    description: 'Learn effective techniques to maintain motivation and focus throughout your online learning journey.',
    tag: 'Science',
    date: '15 Nov, 2024',
    comments: 'Comment_02',
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
  },
];

export default function BlogSection() {
  return (
    <section className="my-16 max-w-7xl mx-auto px-4">
      {/* Title and right description */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <span className="inline-block bg-red-100 text-red-600 font-bold px-4 py-1 rounded-full mb-3">Our Blog</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 leading-tight mb-2">
            Get News <span className="relative inline-block text-blue-700 animate-pulse">With
              <span className="absolute left-0 bottom-0 w-full h-2 bg-blue-200 rounded-full -z-10 animate-underline" style={{ zIndex: -1 }}></span>
            </span> MieT
          </h2>
        </div>
        <div className="flex flex-col items-start md:items-end gap-3">
          <div className="text-blue-800 max-w-md text-base mb-2 md:mb-0">Discover your interests, enroll, and start learning with confidence today!</div>
          <a href="/blog" className="flex items-center gap-2 px-7 py-3 bg-blue-700 text-white font-bold rounded-full shadow hover:bg-blue-800 transition text-lg self-start md:self-auto animate-fade-in">
            Browse More
            <span className="inline-flex items-center justify-center w-8 h-8 bg-white text-blue-700 rounded-full ml-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </a>
        </div>
      </div>
      {/* Blog cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {blogs.map(blog => (
          <div key={blog.id} className="flex flex-col">
            <div className="relative group rounded-2xl overflow-hidden mb-4">
              <img
                src={blog.img}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
              />
              {/* Hover effect: floating blue button */}
              <a
                href={`/blog/${blog.id}`}
                className="absolute top-4 right-4 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg z-10"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
                aria-label="Read more"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 17l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-2">
                <span className="border border-gray-300 rounded-full px-4 py-1 font-semibold text-gray-700 bg-white">{blog.tag}</span>
                <span>{blog.date}</span>
                <span>{blog.comments}</span>
              </div>
              <h3 className="font-extrabold text-xl text-blue-900 mb-1">{blog.title}</h3>
              <p className="text-gray-700 mb-2">{blog.description}</p>
            </div>
          </div>
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
