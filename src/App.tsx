import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { CustomerApp } from '@/apps/customer/CustomerApp';
import { WorkerApp } from '@/apps/worker/WorkerApp';
import { AdminDashboard } from '@/apps/admin/AdminDashboard';
import { AuthPage } from '@/apps/auth/AuthPage';
import { AlertTriangle } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo role in URL
    const params = new URLSearchParams(window.location.search);
    const demoRole = params.get('demo_role');
    
    if (demoRole) {
      setRole(demoRole);
      setSession({ user: { id: 'demo-user' } });
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId: string) => {
    if (userId === 'demo-user') return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (data) setRole(data.role);
    } catch (e) {
      console.error("Failed to fetch role", e);
    }
    setLoading(false);
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
        <div className="bg-orange-100 p-4 rounded-full text-orange-600 mb-4">
          <AlertTriangle size={48} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Configuration Required</h1>
        <p className="text-slate-600 max-w-md">
          Please add your <code className="bg-slate-200 px-1 rounded text-primary">VITE_SUPABASE_URL</code> and 
          <code className="bg-slate-200 px-1 rounded text-primary">VITE_SUPABASE_ANON_KEY</code> 
          to your Vercel Environment Variables.
        </p>
      </div>
    );
  }

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black text-slate-800 tracking-tight">Initialising LabourConnect...</p>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={!session ? <AuthPage /> : <Navigate to="/" />} />
        
        <Route path="/*" element={
          !session ? <Navigate to="/auth" /> :
          role === 'customer' ? <CustomerApp /> :
          role === 'worker' ? <WorkerApp /> :
          role === 'admin' ? <AdminDashboard /> :
          <div className="p-10 text-center flex flex-col items-center justify-center h-screen space-y-4">
            <p className="text-lg font-bold">Waiting for account activation...</p>
            <button onClick={() => { window.location.href='/auth'; supabase.auth.signOut(); }} className="text-primary font-bold underline">Sign Out</button>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
