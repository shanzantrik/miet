import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import { withAuth } from '../../middleware/auth';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
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
    { key: 'category', label: 'Category', filterable: true, render: (item) => item.category.name },
    {
      key: 'price',
      label: 'Price',
      render: (item) => `₹${item.price.toFixed(2)}`
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.stock > 10 ? 'bg-green-100 text-green-800' :
          item.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
          {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
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
    },
    {
      key: 'createdAt',
      label: 'Added',
      render: (item) => new Date(item.createdAt).toLocaleDateString()
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showNotification('Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const handleRowClick = (product) => {
    router.push(`/admin/products/${product.id}`);
  };

  const handleAction = async (action, productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/products/${productId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} product`);
      }

      showNotification(`Product ${action}d successfully`);
      fetchProducts();
    } catch (error) {
      console.error(`Error ${action}ing product:`, error);
      showNotification(`Failed to ${action} product`, 'error');
    }
  };

  const handleBulkAction = async (action, selectedIds) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/products/bulk/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedIds })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} products`);
      }

      showNotification(`Products ${action}d successfully`);
      fetchProducts();
    } catch (error) {
      console.error(`Error ${action}ing products:`, error);
      showNotification(`Failed to ${action} products`, 'error');
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/products/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export products');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showNotification('Products exported successfully');
    } catch (error) {
      console.error('Error exporting products:', error);
      showNotification('Failed to export products', 'error');
    }
  };

  const actions = (product) => (
    <div className="flex justify-end space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAction(product.status === 'active' ? 'deactivate' : 'activate', product.id);
        }}
        className={`${product.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
          }`}
      >
        {product.status === 'active' ? 'Deactivate' : 'Activate'}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAction('delete', product.id);
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
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Products Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/admin/products/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Product
            </button>
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => document.getElementById('exportMenu').classList.toggle('hidden')}
              >
                Export
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div
                id="exportMenu"
                className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="export-menu"
              >
                <div className="py-1" role="none">
                  <button
                    onClick={() => handleExport('csv')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={products}
          onRowClick={handleRowClick}
          actions={actions}
          bulkActions={[
            {
              label: 'Activate',
              action: (ids) => handleBulkAction('activate', ids)
            },
            {
              label: 'Deactivate',
              action: (ids) => handleBulkAction('deactivate', ids)
            },
            {
              label: 'Delete',
              action: (ids) => handleBulkAction('delete', ids)
            }
          ]}
        />

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

export default withAuth(ProductsPage);
