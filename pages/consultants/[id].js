import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function ConsultantDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (id) {
      fetchConsultant();
      checkAdminStatus();
    }
  }, [id]);

  const fetchConsultant = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/consultants/${id}`);
      if (!response.ok) throw new Error('Failed to fetch consultant details');
      const data = await response.json();
      setConsultant(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching consultant:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`);
      if (response.ok) {
        const user = await response.json();
        setIsAdmin(user.role === 'admin');
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
    }
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(`${API_URL}/api/consultants/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to approve consultant');

      await fetchConsultant();
      alert('Consultant approved successfully');
    } catch (err) {
      alert(err.message);
      console.error('Error approving consultant:', err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading consultant details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchConsultant}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (!consultant) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Consultant not found</p>
        </div>
        <Footer />
      </>
    );
  }

  const { user, bio, categories, ailments, services, rating, totalRatings, documents } = consultant;
  const averageRating = totalRatings > 0 ? (rating / totalRatings).toFixed(1) : 'New';

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                {isAdmin && !consultant.approved && (
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                  >
                    Approve Consultant
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-xl">★</span>
                  <span className="ml-1 text-gray-600">{averageRating}</span>
                  {totalRatings > 0 && (
                    <span className="ml-2 text-sm text-gray-500">({totalRatings} reviews)</span>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${consultant.approved
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  {consultant.approved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
              <p className="text-gray-600 text-lg mb-6">{bio}</p>
            </div>
          </div>
        </div>

        {/* Specializations and Expertise */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <span
                  key={category.id}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Areas of Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {ailments.map(ailment => (
                <span
                  key={ailment.id}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full"
                >
                  {ailment.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Services */}
        {services && services.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Services Offered</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map(service => (
                <div key={service.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-2">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-semibold">₹{service.price}</span>
                    {service.duration && (
                      <span className="text-gray-500">{service.duration} mins</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        {documents && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Certifications & Documents</h2>
            <div className="flex flex-wrap gap-4">
              {documents.split(',').map((doc, index) => (
                <a
                  key={index}
                  href={`${API_URL}/uploads/consultant_docs/${doc}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Document {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              {user.phone && (
                <p className="text-gray-600">
                  <span className="font-semibold">Phone:</span> {user.phone}
                </p>
              )}
            </div>
            {user.address && (
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">Address:</span> {user.address}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
