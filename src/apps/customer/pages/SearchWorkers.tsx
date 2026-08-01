import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, MapPin, Star, ShieldCheck } from 'lucide-react';

export function SearchWorkers() {
  const [searchParams] = useSearchParams();
  const initialSkill = searchParams.get('skill') || '';
  const [skill, setSkill] = useState(initialSkill);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, [skill]);

  const fetchWorkers = async () => {
    setLoading(true);
    // In a real production app, we would use the get_nearby_workers RPC
    // For this build, we query the workers table joined with profiles
    let query = supabase
      .from('workers')
      .select(`
        id, skills, average_rating, daily_rate, location_name,
        profiles (full_name, avatar_url)
      `)
      .eq('is_available', true);
    
    if (skill) {
      query = query.contains('skills', [skill]);
    }

    const { data, error } = await query;
    if (data) setWorkers(data);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="bg-white p-4 space-y-3 sticky top-0 shadow-sm z-20">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <Input 
            className="pl-10 h-11 bg-slate-50 border-none rounded-xl"
            placeholder="Search by skill (e.g. Plumber)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
          {['Plumbing', 'Electrical', 'Cleaning', 'Painting', 'Masonry'].map((s) => (
            <button
              key={s}
              onClick={() => setSkill(s.toLowerCase())}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                skill === s.toLowerCase() ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Map Placeholder / Results */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-between items-center text-sm font-bold text-slate-500">
          <span>{workers.length} Workers Found</span>
          <Button variant="ghost" size="sm" className="h-8">
            <Filter size={14} className="mr-2" /> Sort
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10">Searching nearby workers...</div>
        ) : workers.length === 0 ? (
          <div className="text-center py-10 text-slate-400">No workers found in your area.</div>
        ) : (
          workers.map((worker) => (
            <div key={worker.id} className="bg-white rounded-2xl p-4 shadow-sm border hover:border-primary transition-all cursor-pointer">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex-shrink-0 overflow-hidden">
                  {worker.profiles?.avatar_url ? (
                    <img src={worker.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xl">
                      {worker.profiles?.full_name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-1">
                      <h4 className="font-bold text-slate-800">{worker.profiles?.full_name}</h4>
                      <ShieldCheck size={14} className="text-blue-500" />
                    </div>
                    <span className="font-bold text-primary">₹{worker.daily_rate}/day</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500 space-x-2 mt-1">
                    <div className="flex items-center text-yellow-500">
                      <Star size={12} className="fill-current mr-1" />
                      <span className="font-bold">{worker.average_rating}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center">
                      <MapPin size={12} className="mr-1" />
                      <span>{worker.location_name || '1.2km away'}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {worker.skills?.slice(0, 3).map((s: string) => (
                      <span key={s} className="bg-slate-100 text-[10px] font-bold text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button className="flex-1 h-10 font-bold rounded-xl">Book Now</Button>
                <Button variant="outline" className="flex-1 h-10 font-bold rounded-xl">View Profile</Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
