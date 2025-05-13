const events = [
  {
    date: '2025-06-01', title: 'Webinar: Inclusive Classrooms', description: 'Join our experts for a live webinar on inclusive teaching strategies.', icon: (
      <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8" rx="4" fill="currentColor" /></svg>
    ), color: 'bg-blue-50'
  },
  {
    date: '2025-06-15', title: 'Community Fair', description: 'Meet our consultants and partners at the annual community fair.', icon: (
      <svg className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" /></svg>
    ), color: 'bg-pink-50'
  },
  {
    date: '2025-07-10', title: 'Workshop: Assistive Technology', description: 'Hands-on workshop for parents and teachers.', icon: (
      <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" /></svg>
    ), color: 'bg-yellow-50'
  },
];

export default function UpcomingEvents() {
  return (
    <section className="my-16 max-w-7xl mx-auto px-4">
      {/* Title and right description */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <span className="inline-block bg-red-100 text-red-600 font-bold px-4 py-1 rounded-full mb-3">Top Events</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 leading-tight mb-2">
            Find <span className="relative inline-block text-blue-700 animate-pulse">Events
              <span className="absolute left-0 bottom-0 w-full h-2 bg-blue-200 rounded-full -z-10 animate-underline" style={{ zIndex: -1 }}></span>
            </span> Near You
          </h2>
        </div>
        <div className="flex flex-col items-start md:items-end gap-3">
          <div className="text-blue-800 max-w-md text-base mb-2 md:mb-0">Explore a range of events tailored to your interests and professional growth.</div>
          <a href="/events" className="flex items-center gap-2 px-7 py-3 bg-blue-700 text-white font-bold rounded-full shadow hover:bg-blue-800 transition text-lg self-start md:self-auto animate-fade-in">
            Browse More
            <span className="inline-flex items-center justify-center w-8 h-8 bg-white text-blue-700 rounded-full ml-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </a>
        </div>
      </div>
      {/* Event cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {events.map((e, i) => (
          <div key={i} className={`rounded-2xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col items-start ${e.color} border border-blue-100`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-blue-100">
                {e.icon}
              </span>
              <span className="text-blue-700 font-semibold text-sm bg-blue-100 px-3 py-1 rounded-full">{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="font-bold text-lg text-blue-900 mb-2 leading-snug">{e.title}</div>
            <div className="text-blue-800 mb-4 text-sm flex-1">{e.description}</div>
            <a href="/events" className="mt-auto px-5 py-2 bg-blue-600 text-white rounded-full font-bold shadow hover:bg-blue-700 transition flex items-center gap-2 text-sm">
              Learn More
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
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
