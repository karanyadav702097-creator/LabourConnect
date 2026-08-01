import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, User, MapPin, Eye, Check, X } from 'lucide-react';

export function VerificationQueue() {
  const [pendingWorkers, setPendingWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const { data, error } = await supabase
      .from('workers')
      .select('*, profiles(full_name, phone)')
      .eq('verification_status', 'pending');
    
    if (data) setPendingWorkers(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Pending KYC Verifications</h3>
        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
          {pendingWorkers.length} Pending
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div>Loading queue...</div>
        ) : pendingWorkers.length === 0 ? (
          <div className="col-span-2 text-center py-20 bg-white rounded-2xl text-slate-400">
            No pending verifications at this time.
          </div>
        ) : (
          pendingWorkers.map((worker) => (
            <Card key={worker.id} className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 flex items-start space-x-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center text-slate-300">
                    <User size={32} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{worker.profiles?.full_name}</h4>
                    <p className="text-sm text-slate-500">{worker.profiles?.phone}</p>
                    <div className="flex items-center text-xs text-slate-400 mt-1">
                      <MapPin size={12} className="mr-1" />
                      {worker.location_name || 'Location not specified'}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                       {worker.skills?.map((s: string) => (
                         <span key={s} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{s}</span>
                       ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aadhaar Card</p>
                      <div className="aspect-[3/2] bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                        <Eye size={20} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Selfie</p>
                      <div className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                        <Eye size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 h-10 font-bold rounded-xl">
                      <Check size={18} className="mr-2" /> Approve
                    </Button>
                    <Button variant="destructive" className="flex-1 h-10 font-bold rounded-xl">
                      <X size={18} className="mr-2" /> Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
