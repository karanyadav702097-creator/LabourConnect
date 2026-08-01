import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle2, Clock, IndianRupee, MapPin, 
  Navigation, Phone, ShieldCheck 
} from 'lucide-react';

interface WorkerHomeProps {
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
}

export function WorkerHome({ isOnline, setIsOnline }: WorkerHomeProps) {
  return (
    <div className="p-4 space-y-6">
      {/* Availability Card */}
      <Card className={`border-none shadow-xl transition-all ${isOnline ? 'bg-primary text-white' : 'bg-white text-slate-800'}`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold">Good Morning, Rajesh!</h2>
              <p className={isOnline ? 'text-blue-100' : 'text-slate-500'}>
                {isOnline ? 'You are visible to customers' : 'Go online to start receiving jobs'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${isOnline ? 'bg-white/20' : 'bg-slate-100'}`}>
              <ShieldCheck size={14} className="inline mr-1" /> Verified
            </div>
          </div>
          
          <Button 
            onClick={() => setIsOnline(!isOnline)}
            className={`w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-all ${
              isOnline 
                ? 'bg-white text-primary hover:bg-blue-50' 
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Button>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="bg-green-50 p-2 rounded-lg mb-2">
              <IndianRupee size={20} className="text-green-600" />
            </div>
            <span className="text-2xl font-bold">₹1,250</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Today's Earnings</span>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="bg-blue-50 p-2 rounded-lg mb-2">
              <CheckCircle2 size={20} className="text-blue-600" />
            </div>
            <span className="text-2xl font-bold">03</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Jobs Completed</span>
          </CardContent>
        </Card>
      </div>

      {/* Active / Next Job */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Active Job</h3>
        <Card className="border-primary/20 shadow-md overflow-hidden">
          <div className="bg-primary/5 px-4 py-2 flex justify-between items-center border-b">
            <span className="text-xs font-bold text-primary">IN PROGRESS</span>
            <span className="text-xs text-slate-500 font-medium">Job ID: #LC-9821</span>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full" />
              <div>
                <h4 className="font-bold text-slate-800">Amit Verma</h4>
                <div className="flex items-center text-xs text-slate-500">
                  <MapPin size={12} className="mr-1" /> Civil Lines, Nagpur (2.1 km)
                </div>
              </div>
              <Button size="icon" variant="outline" className="ml-auto rounded-full text-green-600 border-green-200">
                <Phone size={18} />
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold">Pipe Leakage Repair</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Payment:</span>
                <span className="font-bold text-green-600">₹400 (Online)</span>
              </div>
            </div>
            <div className="mt-6 flex space-x-2">
              <Button className="flex-1 rounded-xl h-12 font-bold bg-green-600 hover:bg-green-700">
                Complete Job
              </Button>
              <Button variant="outline" className="rounded-xl h-12 px-4">
                <Navigation size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">New Requests</h3>
          <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">02 NEW</span>
        </div>
        <div className="space-y-3">
          {[1].map((i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border flex flex-col space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-100 p-2 rounded-lg"><Clock size={18} className="text-slate-500" /></div>
                  <div>
                    <h5 className="font-bold text-sm">Urgent: Circuit Break</h5>
                    <p className="text-[10px] text-slate-500">Dharampeth • 3.5 km away</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹650</p>
                  <p className="text-[10px] text-slate-400">Scheduled: 2 PM</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 h-9 rounded-lg text-xs font-bold">Accept</Button>
                <Button variant="ghost" className="flex-1 h-9 rounded-lg text-xs font-bold text-slate-400">Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
