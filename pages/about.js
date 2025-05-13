import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Partners from '../components/Partners';
import Testimonials from '../components/Testimonials';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      {/* Hero/Intro Section */}
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
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-blue-900 leading-tight">
              Empowering Every Unique Mind
            </h1>
            <p className="mb-8 text-gray-700 text-lg max-w-xl">MieT is dedicated to providing specialized education and mental health services for children with unique needs, integrating the latest technology and best practices. We are committed to making a difference in the lives of children and their families.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/consultants" className="px-8 py-3 bg-blue-900 text-white font-bold rounded-full shadow hover:bg-blue-800 transition text-lg flex items-center gap-2">Meet Our Consultants <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
              <a href="/products" className="px-8 py-3 bg-red-100 text-red-600 font-bold rounded-full shadow hover:bg-red-200 transition text-lg flex items-center gap-2">Browse Products <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" opacity=".2" /><polygon points="10,8 16,12 10,16" fill="#dc2626" /></svg></a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-blue-100 text-blue-600 font-bold px-4 py-1 rounded-full mb-4">Our Mission</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 mb-4">To provide specialized education and mental health services for children with unique needs, integrating the latest technology and best practices.</h2>
        </div>
        <div>
          <span className="inline-block bg-yellow-100 text-yellow-600 font-bold px-4 py-1 rounded-full mb-4">Our Vision</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 mb-4">To be the leading platform for inclusive education and holistic well-being, empowering children and families worldwide.</h2>
        </div>
      </section>

      {/* Founders/Team Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block bg-pink-100 text-pink-600 font-bold px-4 py-1 rounded-full mb-4">About the Founders</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-8">Meet the Visionaries Behind MieT</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Founder Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-blue-200">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Founder 1" className="w-28 h-28 rounded-full border-4 border-blue-100 mb-4 object-cover" />
              <div className="font-bold text-lg text-blue-900 mb-1">Dr. Arjun Mehta</div>
              <div className="text-blue-600 font-semibold mb-2">Co-Founder & Special Educator</div>
              <p className="text-gray-600 text-sm mb-2">Passionate about inclusive education and technology-driven learning. 15+ years of experience in special education.</p>
            </div>
            {/* Founder Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-yellow-200">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Founder 2" className="w-28 h-28 rounded-full border-4 border-yellow-100 mb-4 object-cover" />
              <div className="font-bold text-lg text-blue-900 mb-1">Ms. Priya Sharma</div>
              <div className="text-yellow-600 font-semibold mb-2">Co-Founder & Child Psychologist</div>
              <p className="text-gray-600 text-sm mb-2">Dedicated to mental health and family well-being. 12+ years of experience in child psychology and therapy.</p>
            </div>
            {/* Founder Card 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-pink-200">
              <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Founder 3" className="w-28 h-28 rounded-full border-4 border-pink-100 mb-4 object-cover" />
              <div className="font-bold text-lg text-blue-900 mb-1">Mr. Ravi Kumar</div>
              <div className="text-pink-600 font-semibold mb-2">Co-Founder & Tech Lead</div>
              <p className="text-gray-600 text-sm mb-2">Expert in edtech solutions and digital transformation. 10+ years of experience in technology for education.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners/Brands Section */}
      <Partners />

      {/* Testimonials Section */}
      <Testimonials />

      <Footer />
    </>
  );
}
