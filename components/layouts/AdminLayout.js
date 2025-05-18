import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ScienceIcon from '@mui/icons-material/Science';
import RateReviewIcon from '@mui/icons-material/RateReview';

const menuItems = [
  { text: 'Dashboard', href: '/admin', icon: <DashboardIcon /> },
  { text: 'Users', href: '/admin/users', icon: <PeopleIcon /> },
  { text: 'Consultants', href: '/admin/consultants', icon: <PersonIcon /> },
  { text: 'Products', href: '/admin/products', icon: <InventoryIcon /> },
  { text: 'Categories', href: '/admin/categories', icon: <CategoryIcon /> },
  { text: 'Ailments', href: '/admin/ailments', icon: <LocalHospitalIcon /> },
  { text: 'Specializations', href: '/admin/specializations', icon: <ScienceIcon /> },
  { text: 'Orders', href: '/admin/orders', icon: <ShoppingCartIcon /> },
  { text: 'Reviews', href: '/admin/reviews', icon: <RateReviewIcon /> },
  { text: 'Settings', href: '/admin/settings', icon: <SettingsIcon /> },
];

function AdminLayout({ children }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    // Add logout logic here
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4">
          <h1 className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>Admin Panel</h1>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${router.pathname === item.href ? 'bg-gray-100' : ''
                }`}
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-4">{item.text}</span>}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
          >
            <LogoutIcon />
            {isSidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isSidebarOpen ? '←' : '→'}
            </button>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
