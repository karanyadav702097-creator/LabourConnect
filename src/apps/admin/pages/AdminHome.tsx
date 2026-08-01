import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, UserCheck, TrendingUp, AlertTriangle, 
  IndianRupee, Briefcase, Clock 
} from 'lucide-react';

export function AdminHome() {
  const stats = [
    { label: 'Total Workers', value: '1,284', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Bookings', value: '42', icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Pending KYC', value: '12', icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Monthly Revenue', value: '₹4.2L', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <Card key={s.label} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                  <h3 className="text-3xl font-bold mt-2">{s.value}</h3>
                </div>
                <div className={`${s.bg} ${s.color} p-3 rounded-xl`}>
                  <s.icon size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-green-600 font-bold">
                <TrendingUp size={12} className="mr-1" />
                <span>+12.5% from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-widest border-b">
                  <th className="pb-4 font-bold">Booking ID</th>
                  <th className="pb-4 font-bold">Worker</th>
                  <th className="pb-4 font-bold">Customer</th>
                  <th className="pb-4 font-bold">Amount</th>
                  <th className="pb-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-4 font-bold text-slate-600">#LC-90{i}1</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-full" />
                        <span className="font-semibold text-slate-700">Rajesh K.</span>
                      </div>
                    </td>
                    <td className="py-4 font-medium text-slate-500">Sunil M.</td>
                    <td className="py-4 font-bold">₹450</td>
                    <td className="py-4">
                      <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-[10px] font-bold">COMPLETED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Alerts & Critical Issues */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-destructive/5 border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertTriangle size={20} />
                <CardTitle className="text-lg">Open SOS Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-destructive/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-800">Worker: Sunil D.</span>
                    <span className="text-[10px] text-destructive font-bold animate-pulse">LIVE</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Location: Sadar Bazar, Nagpur</p>
                  <Button variant="destructive" size="sm" className="w-full text-xs font-bold">Dispatch Support</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">KYC Queue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                    <div>
                      <p className="text-sm font-bold">Vijay Singh</p>
                      <p className="text-[10px] text-slate-400">Plumbing • Nagpur</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold">Review</Button>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs font-bold text-primary">View All Pending</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
