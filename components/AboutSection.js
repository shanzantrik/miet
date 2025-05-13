export default function AboutSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">
        {/* Left: Image with badge overlay */}
        <div className="relative flex flex-col items-center">
          <img
            src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=500&q=80"
            alt="About visual"
            className="w-80 h-80 object-cover rounded-3xl shadow-lg border-4 border-blue-100"
          />
          <div className="absolute top-8 left-8 bg-white rounded-xl shadow-lg px-6 py-3 flex items-center gap-3 border-2 border-blue-200">
            <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="currentColor" opacity=".1" /><path d="M16 8v8l6 3" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div>
              <div className="text-2xl font-extrabold text-blue-900">25+</div>
              <div className="text-blue-800 text-sm font-semibold">Years of Experiences</div>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=300&q=80"
            alt="About visual 2"
            className="w-48 h-32 object-cover rounded-2xl shadow-lg border-4 border-yellow-100 absolute -bottom-8 left-24"
          />
        </div>
        {/* Right: Text content */}
        <div className="relative z-10">
          <span className="inline-block bg-red-100 text-red-600 font-bold px-4 py-1 rounded-full mb-4">About Us</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-blue-900 leading-tight">
            Your Gateway to <span className="relative inline-block"><span className="text-blue-600 underline decoration-wavy decoration-4">Lifelong</span></span> Learning Success
          </h2>
          <p className="mb-8 text-gray-700 text-lg max-w-xl">Join us to embark on a journey of continuous growth and success, tailored to your unique learning needs.</p>
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <span className="bg-blue-600 text-white rounded-full p-2"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24"><path d="M12 2v10l6 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              <div>
                <div className="font-bold text-blue-900">Our Mission:</div>
                <div className="text-gray-700">To provide accessible, high-quality education and mental health support that empowers individuals to achieve their personal and professional goals.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="bg-blue-600 text-white rounded-full p-2"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24"><path d="M12 2v10l6 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              <div>
                <div className="font-bold text-blue-900">Our Vision:</div>
                <div className="text-gray-700">To be a global leader in inclusive education, transforming the way people learn and grow by offering innovative, accessible solutions for all backgrounds.</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/about" className="px-8 py-3 bg-blue-900 text-white font-bold rounded-full shadow hover:bg-blue-800 transition text-lg flex items-center gap-2">Know More <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
            <a href="/consultants" className="px-8 py-3 bg-red-100 text-red-600 font-bold rounded-full shadow hover:bg-red-200 transition text-lg flex items-center gap-2">Live Class <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" opacity=".2" /><polygon points="10,8 16,12 10,16" fill="#dc2626" /></svg></a>
          </div>
        </div>
      </div>
    </section>
  );
}
