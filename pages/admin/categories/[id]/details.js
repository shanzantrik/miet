import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/admin/AdminLayout';
import Notification from '../../../../components/common/Notification';
import { withAuth } from '../../../../middleware/auth';

function CategoryDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/categories/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }

      const data = await response.json();
      setCategory(data);
    } catch (error) {
      console.error('Error fetching category:', error);
      showNotification('Failed to fetch category', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/categories/${id}/${newStatus}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${newStatus} category`);
      }

      showNotification(`Category ${newStatus}d successfully`);
      fetchCategory();
    } catch (error) {
      console.error(`Error ${newStatus}ing category:`, error);
      showNotification(`Failed to ${newStatus} category`, 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      showNotification('Category deleted successfully');
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      showNotification('Failed to delete category', 'error');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!category) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Category not found</h2>
            <p className="mt-2 text-gray-600">The category you're looking for doesn't exist or has been deleted.</p>
            <button
              onClick={() => router.push('/admin/categories')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Categories
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Category Details</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push(`/admin/categories/${id}/edit`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Category
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Category
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                  <dl className="mt-4 space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{category.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Slug</dt>
                      <dd className="mt-1 text-sm text-gray-900">{category.slug}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {category.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Parent Category</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {category.parent ? category.parent.name : 'None'}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Category Image</h3>
                  <div className="mt-4">
                    <img
                      src={category.image || '/placeholder.png'}
                      alt={category.name}
                      className="h-48 w-48 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                <div className="mt-4 prose prose-sm text-gray-500">
                  {category.description || 'No description provided.'}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Products</h3>
                <div className="mt-4">
                  {category.products && category.products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {category.products.map(product => (
                        <div
                          key={product.id}
                          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <div className="flex-shrink-0">
                            <img
                              src={product.image || '/placeholder.png'}
                              alt={product.name}
                              className="h-12 w-12 object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <a
                              href={`/admin/products/${product.id}`}
                              className="focus:outline-none"
                            >
                              <p className="text-sm font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">₹{product.price}</p>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No products in this category.</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Actions</h3>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => handleStatusChange(category.status === 'active' ? 'deactivate' : 'activate')}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${category.status === 'active'
                        ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    {category.status === 'active' ? 'Deactivate' : 'Activate'} Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Notification
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />
      </div>
    </AdminLayout>
  );
}

export default withAuth(CategoryDetails);
