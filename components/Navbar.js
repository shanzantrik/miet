import { useState } from 'react';
import SearchBar from './SearchBar';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const consultantsDropdown = [
  {
    name: 'All Consultants', href: '/consultants', icon: (
      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" /></svg>
    )
  },
  {
    name: 'Featured', href: '/consultants?featured=true', icon: (
      <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor" /></svg>
    )
  },
  {
    name: 'By Location', href: '/consultants?filter=location', icon: (
      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" /></svg>
    )
  },
];

const productsMegaMenu = [
  {
    title: 'Categories',
    items: [
      {
        name: 'Apps', href: '/products?cat=apps', icon: (
          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" /></svg>
        )
      },
      {
        name: 'E-Books', href: '/products?cat=ebooks', icon: (
          <svg className="h-5 w-5 text-pink-500" fill="none" viewBox="0 0 24 24"><path d="M6 4h12v16H6z" fill="currentColor" /><path d="M6 4v16M18 4v16" stroke="#fff" strokeWidth="2" /></svg>
        )
      },
      {
        name: 'Assessment Tools', href: '/products?cat=tools', icon: (
          <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" /></svg>
        )
      },
    ],
  },
  {
    title: 'Services',
    items: [
      {
        name: 'Workshops', href: '/products?cat=workshops', icon: (
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8" rx="4" fill="currentColor" /></svg>
        )
      },
      {
        name: 'Webinars', href: '/products?cat=webinars', icon: (
          <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="M8 12h8" stroke="#fff" strokeWidth="2" /></svg>
        )
      },
      {
        name: 'Community', href: '/products?cat=community', icon: (
          <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" /><circle cx="12" cy="12" r="4" fill="#fff" /></svg>
        )
      },
    ],
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [megaMenu, setMegaMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  // Custom modal for search
  const SearchModal = ({ open, onClose }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
          <button
            className="absolute top-3 right-3 text-blue-900 hover:text-red-500"
            onClick={onClose}
            aria-label="Close search"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <SearchBar onSearch={() => onClose()} />
        </div>
      </div>
    );
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <LoginForm open={loginOpen} onClose={() => setLoginOpen(false)} onSignup={() => { setLoginOpen(false); setSignupOpen(true); }} />
      <SignupForm open={signupOpen} onClose={() => setSignupOpen(false)} onLogin={() => { setSignupOpen(false); setLoginOpen(true); }} />
      <nav className="max-w-7xl mx-auto px-6 py-4 relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Top row: Logo and actions */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <a href="/" className="font-extrabold text-3xl text-blue-900 tracking-tight flex items-center gap-2">
              <svg className="h-8 w-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
              MieT
            </a>
            <div className="flex items-center gap-2 md:hidden">
              {/* Search icon for mobile */}
              <button onClick={() => setSearchOpen(true)} aria-label="Open search" className="p-2 rounded-full hover:bg-blue-50">
                <svg className="h-6 w-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2" /><path d="M21 21l-4.35-4.35" strokeWidth="2" /></svg>
              </button>
              <button className="md:hidden ml-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
                <svg className="h-7 w-7 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
          {/* Second row: nav links and actions */}
          <div className={`flex-col md:flex md:flex-row md:items-center w-full md:w-auto ${open ? 'flex' : 'hidden'} md:flex mt-4 md:mt-0`}>
            {/* Desktop search bar */}
            <div className="hidden md:flex flex-1 mx-8 max-w-lg items-center">
              <button onClick={() => setSearchOpen(true)} aria-label="Open search" className="p-2 rounded-full hover:bg-blue-50">
                <svg className="h-6 w-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2" /><path d="M21 21l-4.35-4.35" strokeWidth="2" /></svg>
              </button>
              <span className="ml-2 text-blue-400 text-sm">Search</span>
            </div>
            <ul className="md:flex space-x-0 md:space-x-8 items-center font-semibold text-blue-900 text-lg flex-col md:flex-row">
              <li><a href="/about" className="flex items-center gap-2 hover:text-yellow-500 transition"><svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm1 4h-2v6h2V10z" fill="currentColor" /></svg>About</a></li>
              <li className="relative"
                onMouseEnter={() => setDropdown(true)}
                onMouseLeave={() => setDropdown(false)}
              >
                <button className="flex items-center gap-2 hover:text-yellow-500 transition"> <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" /></svg>Consultants
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.293l3.71-3.06a.75.75 0 1 1 .96 1.15l-4.25 3.5a.75.75 0 0 1-.96 0l-4.25-3.5a.75.75 0 0 1 .02-1.06z" /></svg>
                </button>
                {dropdown && (
                  <ul className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-30 animate-fade-in">
                    {consultantsDropdown.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-50 hover:text-yellow-600 transition">{item.icon}{item.name}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li className="relative"
                onMouseEnter={() => setMegaMenu(true)}
                onMouseLeave={() => setMegaMenu(false)}
              >
                <button className="flex items-center gap-2 hover:text-yellow-500 transition"> <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" /></svg>Products
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.293l3.71-3.06a.75.75 0 1 1 .96 1.15l-4.25 3.5a.75.75 0 0 1-.96 0l-4.25-3.5a.75.75 0 0 1 .02-1.06z" /></svg>
                </button>
                {megaMenu && (
                  <div className="absolute left-0 mt-2 w-[700px] bg-white rounded-2xl shadow-2xl p-8 z-30 flex gap-12 animate-fade-in">
                    {productsMegaMenu.map((col) => (
                      <div key={col.title}>
                        <div className="font-bold text-blue-900 mb-2">{col.title}</div>
                        <ul>
                          {col.items.map((item) => (
                            <li key={item.name}>
                              <a href={item.href} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-yellow-50 hover:text-yellow-600 transition">{item.icon}{item.name}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-xl p-4 shadow-md w-56">
                      <div className="font-bold text-blue-900 text-lg mb-2">Special Offer!</div>
                      <div className="text-blue-800 mb-2 text-sm">Get 20% off on your first purchase</div>
                      <a href="/products" className="px-4 py-2 bg-blue-600 text-white rounded-full font-bold shadow hover:bg-blue-700 transition text-sm">Shop Now</a>
                    </div>
                  </div>
                )}
              </li>
              <li>
                <a href="/cart" className="flex items-center gap-2 hover:text-yellow-500 transition">
                  {/* Modern cart SVG */}
                  <svg className="h-6 w-6 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6" /></svg>
                  Cart
                </a>
              </li>
            </ul>
            {/* Login/Signup/Profile - always at end, responsive */}
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-2 mt-4 md:mt-0 ml-0 md:ml-4">
              <button
                onClick={() => setLoginOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-white border border-blue-600 text-blue-900 font-bold rounded-full shadow hover:bg-blue-50 transition text-sm w-full md:w-auto justify-center"
              >
                <svg className="h-5 w-5 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" /><path d="M6 20v-2a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="2" /></svg>
                Log In
              </button>
              <button
                onClick={() => setSignupOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-bold rounded-full shadow hover:bg-blue-700 transition text-sm w-full md:w-auto justify-center"
              >
                Sign Up
                <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <a href="/profile" className="inline-flex items-center ml-0 md:ml-2"><svg className="h-8 w-8 rounded-full border-2 border-blue-600" fill="currentColor" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#e0e7ff" /><circle cx="16" cy="13" r="5" fill="#2563eb" /><path d="M8 26c0-4 8-4 8-4s8 0 8 4" fill="#2563eb" /></svg></a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
