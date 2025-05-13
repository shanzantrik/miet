export default function ConsultantCard({ consultant }) {
  // Generate a random avatar for demo (replace with real avatar if available)
  const avatar = `https://randomuser.me/api/portraits/${consultant.user?.name.includes('Dr.') ? 'women' : 'men'}/${20 + consultant.id}.jpg`;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-blue-200 hover:shadow-2xl transition group relative overflow-hidden">
      <img src={avatar} alt={consultant.user?.name} className="w-20 h-20 rounded-full border-4 border-blue-100 mb-3 object-cover group-hover:scale-105 transition-transform" />
      <div className="font-bold text-lg text-blue-900 mb-1">{consultant.user?.name}</div>
      <div className="text-blue-600 font-semibold mb-2">{consultant.bio.split(',')[0]}</div>
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        {/* Years badge */}
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{consultant.bio.match(/\d+\+?\syears?/)?.[0] || 'Expert'}</span>
        {/* Status badge */}
        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${consultant.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{consultant.approved ? 'Approved' : 'Pending'}</span>
      </div>
      <p className="text-gray-600 text-sm mb-4">{consultant.bio}</p>
      <a href="#" className="mt-auto px-6 py-2 bg-blue-600 text-white font-bold rounded-full shadow hover:bg-blue-700 transition text-sm flex items-center gap-2">View Profile <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
      {/* Decorative shape */}
      <svg className="absolute -right-8 -bottom-8 w-24 h-24 text-blue-50 opacity-80" fill="none" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="currentColor" /></svg>
    </div>
  );
}
