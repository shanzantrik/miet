const partners = [
  {
    name: 'SEMRUSH', icon: (
      <svg className="h-12 w-12 text-purple-600" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="currentColor" opacity=".1" /><path d="M12 24c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12S12 30.627 12 24zm18 0a6 6 0 1 0-12 0 6 6 0 0 0 12 0z" fill="currentColor" /></svg>
    )
  },
  {
    name: 'Clearbit', icon: (
      <svg className="h-12 w-12 text-blue-500" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="currentColor" opacity=".1" /><rect x="12" y="12" width="24" height="24" rx="6" fill="currentColor" /></svg>
    )
  },
  {
    name: 'Dropbox', icon: (
      <svg className="h-12 w-12 text-blue-700" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="currentColor" opacity=".1" /><polygon points="24,8 32,14 24,20 16,14" fill="currentColor" /><polygon points="16,14 24,20 16,26 8,20" fill="currentColor" opacity=".7" /><polygon points="32,14 24,20 32,26 40,20" fill="currentColor" opacity=".7" /></svg>
    )
  },
  {
    name: 'LiveChat', icon: (
      <svg className="h-12 w-12 text-pink-500" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="currentColor" opacity=".1" /><rect x="14" y="18" width="20" height="12" rx="4" fill="currentColor" /><circle cx="24" cy="24" r="2" fill="#fff" /></svg>
    )
  },
  {
    name: 'EduZen', icon: (
      <svg className="h-12 w-12 text-yellow-500" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="currentColor" opacity=".1" /><rect x="16" y="16" width="16" height="16" rx="4" fill="currentColor" /><path d="M24 16v16" stroke="#fff" strokeWidth="2" /><path d="M16 24h16" stroke="#fff" strokeWidth="2" /></svg>
    )
  },
];

export default function Partners() {
  return (
    <section className="my-16">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-blue-900">Trusted By Top Companies & Universities</h2>
      <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-yellow-100 py-6 rounded-2xl shadow flex flex-wrap justify-center items-center gap-8 md:gap-16 max-w-6xl mx-auto">
        {partners.map((p, i) => (
          <div key={i} className="flex flex-col items-center">
            {p.icon}
            <span className="mt-2 text-xs font-semibold text-blue-700 opacity-80">{p.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
