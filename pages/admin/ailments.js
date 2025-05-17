import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import { withAuth } from '../../middleware/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function AilmentsPage() {
  const [ailments, setAilments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAilment, setEditingAilment] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', category_id: '' });
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (item) => (
        <img
          src={item.image || '/placeholder.png'}
          alt={item.name}
          className="h-12 w-12 object-cover rounded"
        />
      )
    },
    { key: 'name', label: 'Name', filterable: true },
    { key: 'slug', label: 'Slug', filterable: true },
    {
      key: 'category',
      label: 'Category',
      filterable: true,
      render: (item) => item.category ? item.category.name : '-'
    },
    {
      key: 'products',
      label: 'Products',
      render: (item) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {item.products?.length || 0} products
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
          {item.status}
        </span>
      )
    }
  ];

  useEffect(() => {
    fetchAilments();
    fetchCategories();
  }, []);

  const fetchAilments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/ailments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ailments');
      }

      const data = await response.json();
      setAilments(data);
    } catch (error) {
      setNotification({
        show: true,
        message: error.message || 'Failed to fetch ailments',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingAilment
        ? `${API_URL}/api/admin/ailments/${editingAilment.id}`
        : `${API_URL}/api/admin/ailments`;

      const response = await fetch(url, {
        method: editingAilment ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(editingAilment ? 'Failed to update ailment' : 'Failed to create ailment');
      }

      setNotification({
        show: true,
        message: editingAilment ? 'Ailment updated successfully' : 'Ailment created successfully',
        type: 'success'
      });

      setIsModalOpen(false);
      setEditingAilment(null);
      setFormData({ name: '', description: '', category_id: '' });
      fetchAilments();
    } catch (error) {
      setNotification({
        show: true,
        message: error.message,
        type: 'error'
      });
    }
  };

  const handleEdit = (ailment) => {
    setEditingAilment(ailment);
    setFormData({
      name: ailment.name,
      description: ailment.description,
      category_id: ailment.category_id
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (ailmentId) => {
    if (!window.confirm('Are you sure you want to delete this ailment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/ailments/${ailmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete ailment');
      }

      setNotification({
        show: true,
        message: 'Ailment deleted successfully',
        type: 'success'
      });

      fetchAilments();
    } catch (error) {
      setNotification({
        show: true,
        message: error.message,
        type: 'error'
      });
    }
  };

  const handleRowClick = (ailment) => {
    router.push(`/admin/ailments/${ailment.id}`);
  };

  const handleAction = async (action, ailmentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/ailments/${ailmentId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} ailment`);
      }

      showNotification(`Ailment ${action}d successfully`);
      fetchAilments();
    } catch (error) {
      console.error(`Error ${action}ing ailment:`, error);
      showNotification(`Failed to ${action} ailment`, 'error');
    }
  };

  const handleBulkAction = async (action, selectedIds) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/ailments/bulk/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedIds })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} ailments`);
      }

      showNotification(`Ailments ${action}d successfully`);
      fetchAilments();
    } catch (error) {
      console.error(`Error ${action}ing ailments:`, error);
      showNotification(`Failed to ${action} ailments`, 'error');
    }
  };

  const actions = (ailment) => (
    <div className="flex justify-end space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAction(ailment.status === 'active' ? 'deactivate' : 'activate', ailment.id);
        }}
        className={`${ailment.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
      >
        {ailment.status === 'active' ? 'Deactivate' : 'Activate'}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(ailment.id);
        }}
        className="text-red-600 hover:text-red-900"
      >
        Delete
      </button>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Ailments</h1>
            <button
              onClick={() => {
                setEditingAilment(null);
                setFormData({ name: '', description: '', category_id: '' });
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Ailment
            </button>
          </div>

          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Description
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Category
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {ailments.map((ailment) => (
                        <tr key={ailment.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {ailment.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {ailment.description}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {categories.find(c => c.id === ailment.category_id)?.name || 'N/A'}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handleEdit(ailment)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(ailment.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      name="category_id"
                      id="category_id"
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingAilment ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingAilment(null);
                      setFormData({ name: '', description: '', category_id: '' });
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </AdminLayout>
  );
}

export default withAuth(AilmentsPage);
