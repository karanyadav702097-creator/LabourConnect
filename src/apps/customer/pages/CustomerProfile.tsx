import React from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, LogOut, ChevronRight, Settings, Shield, Bell, HelpCircle } from 'lucide-react';

export function CustomerProfile() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const menuItems = [
    { icon: User, label: 'Edit Profile' },
    { icon: Shield, label: 'Safety & Security' },
    { icon: Bell, label: 'Notifications' },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Support & FAQ' },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center text-center space-y-3 py-6">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary border-4 border-white shadow-xl relative">
          <User size={48} strokeWidth={1.5} />
          <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white">
            <Settings size={14} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Karan Yadav</h2>
          <p className="text-sm text-slate-500 font-medium">+91 98765 43210</p>
        </div>
      </div>

      <div className="space-y-2">
        {menuItems.map((item) => (
          <button 
            key={item.label}
            className="w-full bg-white p-4 rounded-xl flex justify-between items-center shadow-sm border border-slate-50 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-3 text-slate-700">
              <item.icon size={20} className="text-slate-400" />
              <span className="font-bold">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        ))}
      </div>

      <Button 
        variant="ghost" 
        onClick={handleSignOut}
        className="w-full text-destructive hover:bg-red-50 hover:text-destructive font-bold h-12 rounded-xl mt-6"
      >
        <LogOut size={20} className="mr-2" /> Sign Out
      </Button>
      
      <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-10">
        LabourConnect v1.0.0 • Nagpur, Maharashtra
      </p>
    </div>
  );
}
