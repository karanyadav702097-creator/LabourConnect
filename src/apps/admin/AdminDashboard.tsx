import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCheck, CreditCard, 
  AlertOctagon, FileText, Settings, LogOut, BarChart3
} from 'lucide-react';
import { AdminHome } from './pages/AdminHome';
import { VerificationQueue } from './pages/VerificationQueue';
import { UserManagement } from './pages/UserManagement';

export function AdminDashboard() {
  const location = useLocation();

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/' },
    { icon: UserCheck, label: 'KYC Verification', path: '/verify', badge: '12' },
    { icon: Users, label: 'User Management', path: '/users' },
    { icon: CreditCard, label: 'Payments & Payouts', path: '/payments' },
    { icon: AlertOctagon, label: 'Disputes & SOS', path: '/disputes', badge: '2' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: FileText, label: 'Audit Logs', path: '/logs' },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col hidden md:flex">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary">LabourConnect</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Admin Console</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-primary text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={20} />
                  <span className="font-semibold">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white text-primary' : 'bg-red-50 text-red-600'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl">
            <Settings size={20} />
            <span className="font-semibold">Settings</span>
          </Link>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-destructive hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={20} />
            <span className="font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b px-8 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">
            {sidebarItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] text-white">AD</div>
              <span className="text-sm font-bold text-slate-700">Admin_Nagpur</span>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/verify" element={<VerificationQueue />} />
            <Route path="/users" element={<UserManagement />} />
            {/* Other routes omitted for brevity but would follow same pattern */}
          </Routes>
        </div>
      </main>
    </div>
  );
}
