import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Wallet, User, Bell, AlertTriangle } from 'lucide-react';
import { WorkerHome } from './pages/WorkerHome';
import { WorkerJobs } from './pages/WorkerJobs';
import { WorkerWallet } from './pages/WorkerWallet';
import { WorkerProfile } from './pages/WorkerProfile';
import { Button } from '@/components/ui/button';

export function WorkerApp() {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ClipboardList, label: 'Jobs', path: '/jobs' },
    { icon: Wallet, label: 'Earnings', path: '/wallet' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header with Availability Toggle */}
      <header className="bg-white px-4 py-3 border-b flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
          <span className="font-bold text-slate-700">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="destructive" 
            size="icon" 
            className="rounded-full w-9 h-9 shadow-lg shadow-red-200"
            onClick={() => alert('SOS Triggered! Safety team notified.')}
          >
            <AlertTriangle size={18} />
          </Button>
          <button className="relative p-2 text-slate-600">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Routes>
          <Route path="/" element={<WorkerHome isOnline={isOnline} setIsOnline={setIsOnline} />} />
          <Route path="/jobs" element={<WorkerJobs />} />
          <Route path="/wallet" element={<WorkerWallet />} />
          <Route path="/profile" element={<WorkerProfile />} />
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
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
