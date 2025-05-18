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
