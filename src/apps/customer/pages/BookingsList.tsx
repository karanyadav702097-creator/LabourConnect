import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export function BookingsList() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        workers (
          profiles (full_name, avatar_url),
          skills
        )
      `)
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setBookings(data);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      case 'accepted': return 'text-blue-600 bg-blue-50';
      case 'in_progress': return 'text-primary bg-primary/10';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-slate-800">My Bookings</h2>
      
      {loading ? (
        <div className="text-center py-10">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-4 bg-slate-50 rounded-full text-slate-400">
              <Clock size={40} />
            </div>
            <div>
              <p className="font-bold text-slate-600">No Bookings Found</p>
              <p className="text-sm text-slate-400">You haven't booked any workers yet.</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/search'}>Find Workers</Button>
          </CardContent>
        </Card>
      ) : (
        bookings.map((booking) => (
          <Card key={booking.id} className="border-none shadow-sm overflow-hidden">
            <div className={`px-4 py-2 flex justify-between items-center ${getStatusColor(booking.status)}`}>
              <span className="text-[10px] font-bold uppercase tracking-widest">{booking.status.replace('_', ' ')}</span>
              <span className="text-[10px] font-medium">{new Date(booking.scheduled_at).toLocaleDateString()}</span>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">{booking.workers?.profiles?.full_name}</h4>
                  <p className="text-xs text-slate-500">{booking.workers?.skills?.[0]}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">₹{booking.total_price}</p>
                  <p className="text-[10px] text-slate-400">{booking.payment_method?.toUpperCase()}</p>
                </div>
              </div>
              
              <div className="flex items-center text-xs text-slate-500 mb-4">
                <MapPin size={12} className="mr-1" />
                <span className="truncate">{booking.job_location_name || 'Work Address'}</span>
              </div>

              {booking.status === 'accepted' && booking.job_pin && (
                <div className="bg-primary/5 p-3 rounded-lg mb-4 flex justify-between items-center">
                  <span className="text-xs font-bold text-primary">Job Start PIN:</span>
                  <span className="text-lg font-mono font-black tracking-widest text-primary">{booking.job_pin}</span>
                </div>
              )}

              <div className="flex space-x-2">
                {booking.status === 'pending' && (
                  <Button variant="destructive" className="flex-1 h-9 text-xs font-bold rounded-lg">Cancel</Button>
                )}
                <Button variant="outline" className="flex-1 h-9 text-xs font-bold rounded-lg">View Details</Button>
                {booking.status === 'completed' && (
                  <Button className="flex-1 h-9 text-xs font-bold rounded-lg">Review</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
