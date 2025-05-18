import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConsultantCard from '../components/ConsultantCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function ConsultantsPage() {
  const router = useRouter();
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    ailment: '',
    search: '',
    approved: true
  });

  useEffect(() => {
    fetchConsultants();
  }, [filters]);

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.ailment) queryParams.append('ailment', filters.ailment);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.approved !== undefined) queryParams.append('approved', filters.approved);

      const response = await fetch(`${API_URL}/api/consultants?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch consultants');

      const data = await response.json();
      setConsultants(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching consultants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchConsultants();
  };

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

      {/* Filter Bar */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-3 items-center justify-center md:justify-between bg-white rounded-2xl shadow p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('category', '')}
              className={`px-5 py-2 ${!filters.category ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'} font-bold rounded-full hover:bg-blue-200 transition`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('category', 'special-educator')}
              className={`px-5 py-2 ${filters.category === 'special-educator' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700'} font-bold rounded-full hover:bg-yellow-200 transition`}
            >
              Special Educator
            </button>
            <button
              onClick={() => handleFilterChange('category', 'psychologist')}
              className={`px-5 py-2 ${filters.category === 'psychologist' ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-700'} font-bold rounded-full hover:bg-pink-200 transition`}
            >
              Psychologist
            </button>
            <button
              onClick={() => handleFilterChange('category', 'therapist')}
              className={`px-5 py-2 ${filters.category === 'therapist' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'} font-bold rounded-full hover:bg-green-200 transition`}
            >
              Therapist
            </button>
          </div>
          <form onSubmit={handleSearch} className="flex items-center gap-2 mt-3 md:mt-0">
            <input
              type="text"
              placeholder="Search consultants..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="px-4 py-2 rounded-full border border-blue-200 focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="max-w-5xl mx-auto px-4 text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading consultants...</p>
        </div>
      )}

      {error && (
        <div className="max-w-5xl mx-auto px-4 text-center py-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchConsultants}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Consultants Grid */}
      {!loading && !error && (
        <div className="max-w-5xl mx-auto px-4">
          {consultants.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No consultants found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {consultants.map(consultant => (
                <ConsultantCard
                  key={consultant.id}
                  consultant={consultant}
                  onClick={() => router.push(`/consultants/${consultant.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-blue-50 via-white to-pink-50 py-16 px-4 md:px-0 overflow-hidden mt-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-4xl font-extrabold text-blue-900 mb-4">Become a MieT Consultant</h2>
            <p className="text-gray-700 mb-6">Are you an expert in education, therapy, or mental health? Join our growing network and make a difference in the lives of children and families.</p>
            <a href="/signup" className="px-8 py-3 bg-blue-700 text-white font-bold rounded-full shadow hover:bg-blue-800 transition text-lg flex items-center gap-2">
              Join as Consultant
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
            alt="Consultant CTA"
            className="w-64 h-64 object-cover rounded-3xl shadow-lg border-4 border-blue-100"
          />
        </div>
      </section>
      <Footer />
    </>
  );
}
