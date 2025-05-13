import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConsultantCard from '../components/ConsultantCard';

const consultants = [
  { id: 1, user: { name: 'Dr. Asha Mehta' }, bio: 'Special Educator, 15+ years experience', approved: true },
  { id: 2, user: { name: 'Mr. Rajiv Kumar' }, bio: 'Child Psychologist, 10+ years experience', approved: true },
  { id: 3, user: { name: 'Ms. Priya Singh' }, bio: 'Speech Therapist, 8+ years experience', approved: true },
  { id: 4, user: { name: 'Dr. Sunita Rao' }, bio: 'Occupational Therapist, 12+ years experience', approved: true },
];

export default function ConsultantsPage() {
  return (
    <>
      <Navbar />
      {/* Hero/Intro Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white py-16 md:py-24 overflow-hidden mb-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
          <span className="inline-block bg-blue-100 text-blue-600 font-bold px-4 py-1 rounded-full mb-4">Our Consultants</span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-blue-900 leading-tight">Meet Our Expert Consultants</h1>
          <p className="mb-8 text-gray-700 text-lg max-w-2xl">Connect with our team of experienced educators, therapists, and specialists dedicated to supporting every unique learner. Browse profiles and find the right consultant for your needs.</p>
        </div>
      </section>
      {/* Filter Bar (UI only) */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-3 items-center justify-center md:justify-between bg-white rounded-2xl shadow p-4">
          <div className="flex flex-wrap gap-2">
            <button className="px-5 py-2 bg-blue-100 text-blue-700 font-bold rounded-full hover:bg-blue-200 transition">All</button>
            <button className="px-5 py-2 bg-yellow-100 text-yellow-700 font-bold rounded-full hover:bg-yellow-200 transition">Special Educator</button>
            <button className="px-5 py-2 bg-pink-100 text-pink-700 font-bold rounded-full hover:bg-pink-200 transition">Psychologist</button>
            <button className="px-5 py-2 bg-green-100 text-green-700 font-bold rounded-full hover:bg-green-200 transition">Therapist</button>
          </div>
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            <input type="text" placeholder="Search consultants..." className="px-4 py-2 rounded-full border border-blue-200 focus:ring-2 focus:ring-blue-400 text-sm" />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition">Search</button>
          </div>
        </div>
      </div>
      {/* Consultants Grid */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {consultants.map(c => (
            <ConsultantCard key={c.id} consultant={c} />
          ))}
        </div>
      </div>
      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-blue-50 via-white to-pink-50 py-16 px-4 md:px-0 overflow-hidden mt-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-4xl font-extrabold text-blue-900 mb-4">Become a MieT Consultant</h2>
            <p className="text-gray-700 mb-6">Are you an expert in education, therapy, or mental health? Join our growing network and make a difference in the lives of children and families.</p>
            <a href="/signup" className="px-8 py-3 bg-blue-700 text-white font-bold rounded-full shadow hover:bg-blue-800 transition text-lg flex items-center gap-2">Join as Consultant <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
          </div>
          <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" alt="Consultant CTA" className="w-64 h-64 object-cover rounded-3xl shadow-lg border-4 border-blue-100" />
        </div>
      </section>
      <Footer />
    </>
  );
}
