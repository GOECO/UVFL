
import React from 'react';
import { useLanguage } from '../App';

const PublicLedger = () => {
  const { t } = useLanguage();
  const pl = t.publicLedger;

  const data = [
    { id: 'TX-8821', user: '0x71...2a', asset: 'USDT', value: '1,200.00', hash: 'sha256:7f8a...e91c', status: 'VERIFIED' },
    { id: 'TX-9022', user: '0x32...1f', asset: 'GOLD', value: '45.50g', hash: 'sha256:a1b2...c3d4', status: 'VERIFIED' },
    { id: 'TX-4410', user: '0x9d...7c', asset: 'USDT', value: '500.00', hash: 'sha256:e5f6...g7h8', status: 'VERIFIED' },
    { id: 'TX-1293', user: '0x1e...bb', asset: 'VND', value: '15,000,000', hash: 'sha256:i9j0...k1l2', status: 'VERIFIED' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-black tracking-tighter uppercase">{pl.title}</h1>
        <p className="text-slate-500 font-medium">{pl.subtitle}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-ivory-border dark:border-slate-800 rounded-[48px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-ivory-surface/50 dark:bg-slate-800/50 border-b border-ivory-border dark:border-slate-800">
              <tr>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Giao dịch</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{pl.anonymized}</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá trị</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{pl.hashChain}</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-border dark:divide-slate-800">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-10 py-6 font-mono text-xs font-bold text-primary">{row.id}</td>
                  <td className="px-10 py-6 font-mono text-xs text-slate-500">{row.user}</td>
                  <td className="px-10 py-6">
                    <span className="text-sm font-black">{row.value}</span>
                    <span className="ml-2 text-[10px] font-bold text-slate-400">{row.asset}</span>
                  </td>
                  <td className="px-10 py-6 font-mono text-[10px] text-slate-400 truncate max-w-[150px]">{row.hash}</td>
                  <td className="px-10 py-6 text-right">
                    <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PublicLedger;
