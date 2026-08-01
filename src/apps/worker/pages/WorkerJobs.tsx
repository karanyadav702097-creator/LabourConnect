import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Phone, MapPin, Clock } from 'lucide-react';

export function WorkerJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('bookings')
      .select('*, profiles (full_name, avatar_url, phone)')
      .eq('worker_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setJobs(data);
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">My Jobs</h2>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button className="px-3 py-1 text-xs font-bold bg-white rounded shadow-sm">Upcoming</button>
          <button className="px-3 py-1 text-xs font-bold text-slate-500">History</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-10 text-slate-400 italic">No job requests found.</div>
      ) : (
        jobs.map((job) => (
          <Card key={job.id} className="border-none shadow-sm overflow-hidden">
             <div className="bg-slate-50 px-4 py-2 flex justify-between items-center border-b">
                <span className={`text-[10px] font-black uppercase ${job.status === 'pending' ? 'text-orange-600' : 'text-primary'}`}>
                  {job.status}
                </span>
                <span className="text-[10px] text-slate-400">{new Date(job.scheduled_at).toLocaleDateString()}</span>
             </div>
             <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-full" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{job.profiles?.full_name}</h4>
                    <p className="text-[10px] text-slate-500 flex items-center">
                      <Clock size={10} className="mr-1" /> {new Date(job.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{job.worker_earning}</p>
                  </div>
                </div>

                <div className="flex items-center text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded-lg">
                  <MapPin size={12} className="mr-1 text-primary" />
                  <span className="truncate">{job.job_location_name || 'Customer Address'}</span>
                </div>

                <div className="flex space-x-2">
                  {job.status === 'pending' ? (
                    <>
                      <Button className="flex-1 h-10 font-bold rounded-xl bg-green-600">Accept</Button>
                      <Button variant="outline" className="flex-1 h-10 font-bold rounded-xl">Reject</Button>
                    </>
                  ) : (
                    <>
                      <Button className="flex-1 h-10 font-bold rounded-xl">Navigate</Button>
                      <Button variant="secondary" className="h-10 w-10 p-0 rounded-xl">
                        <Phone size={18} />
                      </Button>
                    </>
                  )}
                </div>
             </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
