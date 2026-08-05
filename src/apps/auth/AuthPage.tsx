import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Smartphone, ShieldCheck, ArrowRight, UserCircle, Briefcase, ShieldAlert } from 'lucide-react';

export function AuthPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // DEMO LOGIN BYPASS - To avoid "Unsupported Phone Provider" error during your testing
  const handleDemoLogin = async (role: 'customer' | 'worker' | 'admin') => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be a secure OTP flow.
      // For this demo, we use a placeholder login to let you see the UI.
      alert(`Demo Mode: System would now verify OTP. Accessing ${role} dashboard...`);
      
      // We will set a dummy session or redirect to show you the screens
      window.location.href = `/?demo_role=${role}`;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-blue-200 mb-4">
                <ShieldCheck className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">LabourConnect</h1>
            <p className="text-slate-500 font-medium mt-1">India's Smart Daily Labour Marketplace</p>
        </div>

        <Card className="border-none shadow-2xl shadow-blue-100/50 rounded-[2rem] overflow-hidden">
          <CardHeader className="pt-8 pb-0 text-center">
            <CardTitle className="text-xl font-bold text-slate-800">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400">Login with your phone number to continue</CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 border-r pr-3 border-slate-200">
                    <span className="text-sm font-bold text-slate-700">+91</span>
                  </div>
                  <Input
                    className="h-14 pl-16 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-primary/20 transition-all text-lg font-bold tracking-widest"
                    placeholder="80099 74446"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <Button className="w-full h-14 rounded-2xl text-lg font-black shadow-lg shadow-blue-100 group">
                Send OTP
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-300 font-bold tracking-widest">Test Demo Access</span></div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => handleDemoLogin('customer')} className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 hover:border-primary hover:bg-blue-50 transition-all group">
                    <UserCircle className="w-6 h-6 text-slate-400 group-hover:text-primary mb-1" />
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-primary">Customer</span>
                </button>
                <button onClick={() => handleDemoLogin('worker')} className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 hover:border-primary hover:bg-blue-50 transition-all group">
                    <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-primary mb-1" />
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-primary">Worker</span>
                </button>
                <button onClick={() => handleDemoLogin('admin')} className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 hover:border-primary hover:bg-blue-50 transition-all group">
                    <ShieldAlert className="w-6 h-6 text-slate-400 group-hover:text-primary mb-1" />
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-primary">Admin</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center mt-8 text-slate-400 text-sm">
          By continuing, you agree to our <span className="text-primary font-bold">Terms</span> & <span className="text-primary font-bold">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
