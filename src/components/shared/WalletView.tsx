import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IndianRupee, ArrowUpRight, ArrowDownLeft, Calendar, Filter } from 'lucide-react';

export function WalletView() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch Balance
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('profile_id', user.id)
      .single();
    
    if (wallet) setBalance(wallet.balance);

    // Fetch Transactions
    const { data: txs } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', (wallet as any)?.id)
      .order('created_at', { ascending: false });

    if (txs) setTransactions(txs);
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-primary rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Balance</p>
            <h2 className="text-4xl font-black mt-1">₹{balance.toLocaleString('en-IN')}</h2>
          </div>
          <div className="bg-white/20 p-2 rounded-lg">
            <IndianRupee size={24} />
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" className="flex-1 font-bold rounded-xl h-11">Add Money</Button>
          <Button className="flex-1 bg-white/10 hover:bg-white/20 border-white/20 font-bold rounded-xl h-11">Withdraw</Button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Transactions</h3>
          <Button variant="ghost" size="sm" className="text-slate-400">
            <Filter size={16} className="mr-2" /> Filter
          </Button>
        </div>
        
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">No transactions yet.</div>
          ) : (
            transactions.map((tx) => (
              <Card key={tx.id} className="border-none shadow-sm">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{tx.description}</p>
                      <p className="text-[10px] text-slate-400 flex items-center">
                        <Calendar size={10} className="mr-1" />
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-800'}`}>
                      {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                    </p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase">Success</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
