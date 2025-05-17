import { format } from 'date-fns';

export default function RecentOrders({ orders }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {order.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.product ? order.product.name : order.service.name}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    ₹{order.amount}
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {format(new Date(order.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
