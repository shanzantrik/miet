import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import { withAuth } from '../../middleware/auth';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const router = useRouter();

  const columns = [
    {
      key: 'orderNumber',
      label: 'Order #',
      filterable: true,
      render: (item) => `#${item.orderNumber}`
    },
    {
      key: 'customer',
      label: 'Customer',
      filterable: true,
      render: (item) => (
        <div>
          <div className="font-medium">{item.customer.name}</div>
          <div className="text-sm text-gray-500">{item.customer.email}</div>
        </div>
      )
    },
    {
      key: 'items',
      label: 'Items',
      render: (item) => (
        <div className="text-sm">
          {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
        </div>
      )
    },
    {
      key: 'total',
      label: 'Total',
      render: (item) => `₹${item.total.toFixed(2)}`
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'completed' ? 'bg-green-100 text-green-800' :
          item.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            item.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
          }`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      )
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      filterable: true,
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
          item.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
          {item.paymentStatus.charAt(0).toUpperCase() + item.paymentStatus.slice(1)}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (item) => new Date(item.createdAt).toLocaleDateString()
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showNotification('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const handleRowClick = (order) => {
    router.push(`/admin/orders/${order.id}`);
  };

  const handleAction = async (action, orderId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/orders/${orderId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} order`);
      }

      showNotification(`Order ${action}d successfully`);
      fetchOrders();
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      showNotification(`Failed to ${action} order`, 'error');
    }
  };

  const handleBulkAction = async (action, selectedIds) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/orders/bulk/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedIds })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} orders`);
      }

      showNotification(`Orders ${action}d successfully`);
      fetchOrders();
    } catch (error) {
      console.error(`Error ${action}ing orders:`, error);
      showNotification(`Failed to ${action} orders`, 'error');
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/orders/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export orders');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showNotification('Orders exported successfully');
    } catch (error) {
      console.error('Error exporting orders:', error);
      showNotification('Failed to export orders', 'error');
    }
  };

  const actions = (order) => (
    <div className="flex justify-end space-x-2">
      {order.status === 'pending' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAction('process', order.id);
          }}
          className="text-blue-600 hover:text-blue-900"
        >
          Process
        </button>
      )}
      {order.status === 'processing' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAction('complete', order.id);
          }}
          className="text-green-600 hover:text-green-900"
        >
          Complete
        </button>
      )}
      {order.status !== 'cancelled' && order.status !== 'completed' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAction('cancel', order.id);
          }}
          className="text-red-600 hover:text-red-900"
        >
          Cancel
        </button>
      )}
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
          <h1 className="text-2xl font-semibold text-gray-800">Orders Management</h1>
          <div className="flex space-x-4">
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
          data={orders}
          onRowClick={handleRowClick}
          actions={actions}
          bulkActions={[
            {
              label: 'Process',
              action: (ids) => handleBulkAction('process', ids)
            },
            {
              label: 'Complete',
              action: (ids) => handleBulkAction('complete', ids)
            },
            {
              label: 'Cancel',
              action: (ids) => handleBulkAction('cancel', ids)
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

export default withAuth(OrdersPage);
