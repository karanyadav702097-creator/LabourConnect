import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Smartphone, Lock, ArrowRight } from 'lucide-react';

export function AuthPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phone}` });
      if (error) throw error;
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: otp,
        type: 'sms',
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary w-12 h-12 rounded-xl flex items-center justify-center text-white mb-2">
            <Smartphone size={24} />
          </div>
          <CardTitle className="text-2xl font-bold">LabourConnect</CardTitle>
          <CardDescription>
            {step === 'phone' ? 'Enter your phone number to login' : 'Enter the 6-digit OTP sent to your phone'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={step === 'phone' ? handleSendOtp : handleVerifyOtp} className="space-y-4">
            {step === 'phone' ? (
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400 font-medium">+91</span>
                <Input
                  className="pl-12 h-12 text-lg tracking-widest"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                />
              </div>
            ) : (
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                <Input
                  className="pl-12 h-12 text-lg tracking-[0.5em] text-center"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                />
              </div>
            )}

            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            <Button className="w-full h-12 text-lg font-semibold" disabled={loading}>
              {loading ? 'Processing...' : step === 'phone' ? 'Send OTP' : 'Verify & Continue'}
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </form>

          {step === 'otp' && (
            <button
              onClick={() => setStep('phone')}
              className="w-full mt-4 text-sm text-primary font-medium hover:underline"
            >
              Change Phone Number
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
