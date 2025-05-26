import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { getAuthHeaders } from '../../../utils/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function ConsultantsPage() {
  const router = useRouter();
  const { user, loading: authLoading, checkAuth } = useAuth();
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/consultants`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.replace('/admin/login');
          return;
        }
        throw new Error('Failed to fetch consultants');
      }

      const data = await response.json();
      console.log('Fetched consultants:', data);
      setConsultants(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching consultants:', error);
      setError(error.message);
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalChange = async (consultantId, approved) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/consultants/${consultantId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ approved })
      });

      if (!response.ok) {
        throw new Error('Failed to update approval status');
      }

      await fetchConsultants();
      showNotification(`Consultant ${approved ? 'approved' : 'disapproved'} successfully`);
    } catch (error) {
      console.error('Error updating approval status:', error);
      showNotification(error.message, 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  useEffect(() => {
    const init = async () => {
      try {
        await checkAuth();
        if (!user) {
          router.replace('/admin/login');
          return;
        }
        await fetchConsultants();
      } catch (error) {
        console.error('Initialization error:', error);
        setError(error.message);
      }
    };
    init();
  }, [user, checkAuth, router]);

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Consultants</h1>
          <button
            onClick={() => router.push('/admin/consultants/add')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add New Consultant
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specializations
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consultants.map((consultant) => (
                  <tr key={consultant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {consultant.user.image ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={consultant.user.image}
                              alt={consultant.user.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">
                                {consultant.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {consultant.user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{consultant.user.email}</div>
                      <div className="text-sm text-gray-500">{consultant.user.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {consultant.categories.map((category) => (
                          <span
                            key={category.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {consultant.services.length} services
                      </div>
                      <div className="text-xs text-gray-500">
                        From ₹{Math.min(...consultant.services.map(s => s.price))} to ₹{Math.max(...consultant.services.map(s => s.price))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consultant.approved}
                            onChange={(e) => handleApprovalChange(consultant.id, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          <span className="ml-3 text-sm font-medium text-gray-700">
                            {consultant.approved ? 'Approved' : 'Pending'}
                          </span>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {consultant.rating.toFixed(1)}
                        </span>
                        <span className="ml-1 text-xs text-gray-500">
                          ({consultant.totalRatings} reviews)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/admin/consultants/${consultant.id}`)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => router.push(`/admin/consultants/${consultant.id}/view`)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {notification.show && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
            {notification.message}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
