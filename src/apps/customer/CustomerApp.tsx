import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, Wallet, User, Bell } from 'lucide-react';
import { CustomerHome } from './pages/CustomerHome';
import { SearchWorkers } from './pages/SearchWorkers';
import { BookingsList } from './pages/BookingsList';
import { CustomerProfile } from './pages/CustomerProfile';
import { WalletView } from '@/components/shared/WalletView';

export function CustomerApp() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Calendar, label: 'Bookings', path: '/bookings' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white px-4 py-3 border-b flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-primary">LabourConnect</h1>
        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Routes>
          <Route path="/" element={<CustomerHome />} />
          <Route path="/search" element={<SearchWorkers />} />
          <Route path="/bookings" element={<BookingsList />} />
          <Route path="/wallet" element={<WalletView />} />
          <Route path="/profile" element={<CustomerProfile />} />
        </Routes>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 px-2 z-10 shadow-lg">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors ${
                isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
