import { useState, useEffect } from 'react';
import Notification from '../common/Notification';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function PendingConsultants() {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchPendingConsultants();
  }, []);

  const fetchPendingConsultants = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({
          show: true,
          message: 'Authentication required. Please login again.',
          type: 'error'
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/admin/pending-consultants`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          return;
        }

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to fetch pending consultants');
        } else {
          throw new Error('Server error. Please try again later.');
        }
      }

      const data = await response.json();
      setConsultants(data);
    } catch (error) {
      console.error('Error fetching pending consultants:', error);
      setNotification({
        show: true,
        message: error.message || 'Failed to fetch pending consultants. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (consultantId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({
          show: true,
          message: 'Authentication required. Please login again.',
          type: 'error'
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/admin/consultants/${consultantId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          return;
        }

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to approve consultant');
        } else {
          throw new Error('Server error. Please try again later.');
        }
      }

      setConsultants(consultants.filter(c => c.id !== consultantId));
      setNotification({
        show: true,
        message: 'Consultant approved successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error approving consultant:', error);
      setNotification({
        show: true,
        message: error.message || 'Failed to approve consultant. Please try again.',
        type: 'error'
      });
    }
  };

  const handleReject = async (consultantId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({
          show: true,
          message: 'Authentication required. Please login again.',
          type: 'error'
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/admin/consultants/${consultantId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          return;
        }

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to reject consultant');
        } else {
          throw new Error('Server error. Please try again later.');
        }
      }

      setConsultants(consultants.filter(c => c.id !== consultantId));
      setNotification({
        show: true,
        message: 'Consultant rejected successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error rejecting consultant:', error);
      setNotification({
        show: true,
        message: error.message || 'Failed to reject consultant. Please try again.',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Consultants</h3>
        <div className="mt-4">
          {consultants.length === 0 ? (
            <p className="text-sm text-gray-500">No pending consultants</p>
          ) : (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {consultants.map((consultant) => (
                  <li key={consultant.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {consultant.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {consultant.email}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <button
                          onClick={() => handleApprove(consultant.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(consultant.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </div>
  );
}
