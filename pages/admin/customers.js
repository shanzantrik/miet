import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import { withAuth } from '../../middleware/auth';

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const router = useRouter();

  const columns = [
    {
      key: 'name',
      label: 'Name',
      filterable: true,
      render: (item) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full"
              src={item.avatar || '/placeholder.png'}
              alt={item.name}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{item.name}</div>
            <div className="text-sm text-gray-500">{item.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      filterable: true
    },
    {
      key: 'orders',
      label: 'Orders',
      render: (item) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {item.orders?.length || 0} orders
        </span>
      )
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      render: (item) => `$${item.totalSpent?.toFixed(2) || '0.00'}`
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
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/customers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showNotification('Failed to fetch customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const handleRowClick = (customer) => {
    router.push(`/admin/customers/${customer.id}`);
  };

  const handleAction = async (action, customerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/customers/${customerId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} customer`);
      }

      showNotification(`Customer ${action}d successfully`);
      fetchCustomers();
    } catch (error) {
      console.error(`Error ${action}ing customer:`, error);
      showNotification(`Failed to ${action} customer`, 'error');
    }
  };

  const handleBulkAction = async (action, selectedIds) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/customers/bulk/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedIds })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} customers`);
      }

      showNotification(`Customers ${action}d successfully`);
      fetchCustomers();
    } catch (error) {
      console.error(`Error ${action}ing customers:`, error);
      showNotification(`Failed to ${action} customers`, 'error');
    }
  };

  const actions = (customer) => (
    <div className="flex justify-end space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAction(customer.status === 'active' ? 'deactivate' : 'activate', customer.id);
        }}
        className={`${customer.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
      >
        {customer.status === 'active' ? 'Deactivate' : 'Activate'}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/admin/customers/${customer.id}/orders`);
        }}
        className="text-blue-600 hover:text-blue-900"
      >
        View Orders
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
          <h1 className="text-2xl font-semibold text-gray-800">Customers Management</h1>
          <button
            onClick={() => router.push('/admin/customers/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Customer
          </button>
        </div>

        <DataTable
          columns={columns}
          data={customers}
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

export default withAuth(CustomersPage);
