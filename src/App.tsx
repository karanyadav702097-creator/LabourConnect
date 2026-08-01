import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { CustomerApp } from '@/apps/customer/CustomerApp';
import { WorkerApp } from '@/apps/worker/WorkerApp';
import { AdminDashboard } from '@/apps/admin/AdminDashboard';
import { AuthPage } from '@/apps/auth/AuthPage';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (data) setRole(data.role);
    setLoading(false);
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={!session ? <AuthPage /> : <Navigate to="/" />} />
        
        <Route path="/*" element={
          !session ? <Navigate to="/auth" /> :
          role === 'customer' ? <CustomerApp /> :
          role === 'worker' ? <WorkerApp /> :
          role === 'admin' ? <AdminDashboard /> :
          <div className="p-10 text-center">Unauthorized or No Role Assigned</div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
