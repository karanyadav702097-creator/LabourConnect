import React from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { 
  User, LogOut, ChevronRight, Settings, 
  ShieldCheck, HelpCircle, History, Star
} from 'lucide-react';

export function WorkerProfile() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const menuItems = [
    { icon: User, label: 'Skill & Category' },
    { icon: History, label: 'Work History' },
    { icon: ShieldCheck, label: 'Aadhaar Verification', status: 'Verified' },
    { icon: Settings, label: 'Preferences' },
    { icon: HelpCircle, label: 'Help & Support' },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center relative mb-4">
          <User size={48} className="text-primary" />
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
        </div>
        <h2 className="text-xl font-bold">Rajesh Kumar</h2>
        <p className="text-slate-400 text-sm mb-4"> Nagpur, Maharashtra</p>
        
        <div className="flex space-x-8 border-t pt-4 w-full justify-center">
          <div>
            <p className="text-lg font-bold">4.8</p>
            <div className="flex text-yellow-500"><Star size={12} className="fill-current" /></div>
            <p className="text-[10px] text-slate-400 uppercase font-black">Rating</p>
          </div>
          <div className="border-x px-8">
            <p className="text-lg font-bold">124</p>
            <p className="text-[10px] text-slate-400 uppercase font-black">Jobs</p>
          </div>
          <div>
            <p className="text-lg font-bold">₹12k</p>
            <p className="text-[10px] text-slate-400 uppercase font-black">Earned</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {menuItems.map((item) => (
          <button 
            key={item.label}
            className="w-full bg-white p-4 rounded-xl flex justify-between items-center shadow-sm border border-slate-50"
          >
            <div className="flex items-center space-x-3 text-slate-700">
              <item.icon size={20} className="text-slate-400" />
              <span className="font-bold">{item.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              {item.status && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{item.status}</span>}
              <ChevronRight size={18} className="text-slate-300" />
            </div>
          </button>
        ))}
      </div>

      <Button 
        variant="ghost" 
        onClick={handleSignOut}
        className="w-full text-destructive font-bold h-12 rounded-xl mt-4"
      >
        <LogOut size={20} className="mr-2" /> Sign Out
      </Button>
    </div>
  );
}
