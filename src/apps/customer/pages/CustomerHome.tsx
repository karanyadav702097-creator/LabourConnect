import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wrench, Home, Zap, Droplets, PaintBucket, 
  Trash2, ShieldCheck, MapPin, Search as SearchIcon
} from 'lucide-react';

const CATEGORIES = [
  { id: 'plumbing', name: 'Plumbing', icon: Droplets, color: 'bg-blue-50 text-blue-600' },
  { id: 'electrical', name: 'Electrical', icon: Zap, color: 'bg-yellow-50 text-yellow-600' },
  { id: 'cleaning', name: 'Cleaning', icon: Trash2, color: 'bg-green-50 text-green-600' },
  { id: 'painting', name: 'Painting', icon: PaintBucket, color: 'bg-purple-50 text-purple-600' },
  { id: 'carpentry', name: 'Carpentry', icon: Wrench, color: 'bg-orange-50 text-orange-600' },
  { id: 'masonry', name: 'Construction', icon: Home, color: 'bg-slate-50 text-slate-600' },
];

export function CustomerHome() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6">
      {/* Location Banner */}
      <div className="flex items-center space-x-2 text-slate-500 bg-white p-3 rounded-lg shadow-sm border">
        <MapPin size={18} className="text-primary" />
        <span className="text-sm font-medium">Sitabuldi, Nagpur, Maharashtra</span>
      </div>

      {/* Hero Section */}
      <div className="bg-primary rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Need a Professional?</h2>
          <p className="text-blue-100 mb-4 text-sm max-w-[200px]">Find verified daily labourers near you in minutes.</p>
          <Button variant="secondary" onClick={() => navigate('/search')} className="shadow-lg">
            Find Workers Now
          </Button>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-20">
          <ShieldCheck size={140} />
        </div>
      </div>

      {/* Categories Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Categories</h3>
          <button className="text-sm text-primary font-semibold">See All</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <Card 
              key={cat.id} 
              className="border-none shadow-sm cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate(`/search?skill=${cat.id}`)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
                <div className={`p-3 rounded-full ${cat.color}`}>
                  <cat.icon size={24} />
                </div>
                <span className="text-xs font-bold text-slate-700">{cat.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Safety Section */}
      <div className="bg-destructive/5 border border-destructive/10 rounded-xl p-4 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-destructive">Worker Safety SOS</h4>
          <p className="text-xs text-slate-500">24/7 dedicated safety support</p>
        </div>
        <Button variant="destructive" size="sm" className="rounded-full px-6">
          Learn More
        </Button>
      </div>

      {/* Nearby Preview */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Top Rated Near You</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border flex items-center space-x-4">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h5 className="font-bold text-slate-800">Rajesh Kumar</h5>
                  <span className="text-xs font-bold text-green-600">₹450/day</span>
                </div>
                <p className="text-xs text-slate-500">Expert Plumber • 1.2km away</p>
                <div className="flex items-center mt-1 text-yellow-500">
                  <span className="text-xs font-bold mr-1">4.8</span>
                  <div className="flex">{'★'.repeat(5)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
