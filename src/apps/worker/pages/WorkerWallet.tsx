import React from 'react';
import { WalletView } from '@/components/shared/WalletView';

export function WorkerWallet() {
  return (
    <div>
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <h2 className="text-xl font-bold text-slate-800">Earnings</h2>
      </div>
      <WalletView />
    </div>
  );
}
