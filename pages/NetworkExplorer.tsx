
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';

const NetworkExplorer = () => {
  const { t } = useLanguage();
  const net = t.network;

  const [transactions, setTransactions] = useState([
    { id: '0x81FA...E91C', type: 'CREATE', value: '1,200 USDT', country: 'VN', time: '10:20:01', status: 'VALIDATING' },
    { id: '0xFD12...G7H8', type: 'DISTRIBUTE', value: '500 USDT', country: 'US', time: '10:19:45', status: 'FINALIZED' },
    { id: '0xCC81...K1L2', type: 'RENEW', value: 'ROLE_UPDATE', country: 'DE', time: '10:18:30', status: 'FINALIZED' },
    { id: '0x2B90...C3D4', type: 'VALIDATE', value: '45.5 GOLD', country: 'JP', time: '10:15:12', status: 'PROCESSING' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['CREATE', 'VALIDATE', 'DISTRIBUTE', 'RENEW'];
      const countries = ['VN', 'US', 'JP', 'DE', 'FR', 'KR'];
      const newTx = {
        id: `0x${Math.random().toString(16).slice(2, 6).toUpperCase()}...${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
        type: types[Math.floor(Math.random() * types.length)],
        value: `${(Math.random() * 1000).toFixed(2)} USDT`,
        country: countries[Math.floor(Math.random() * countries.length)],
        time: new Date().toLocaleTimeString('en-GB'),
        status: Math.random() > 0.5 ? 'FINALIZED' : 'PROCESSING'
      };
      setTransactions(prev => [newTx, ...prev].slice(0, 10));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Network Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase">{net.title}</h1>
          <p className="text-slate-500 max-w-xl font-medium">{net.subtitle}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white border border-ivory-border rounded-2xl px-6 py-4 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{net.stats.nodes}</p>
            <p className="text-xl font-black text-slate-900">8,103</p>
          </div>
          <div className="bg-white border border-ivory-border rounded-2xl px-6 py-4 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{net.stats.latency}</p>
            <p className="text-xl font-black text-emerald-600">12ms</p>
          </div>
        </div>
      </div>

      {/* Real-time Ledger Table */}
      <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
        <div className="px-10 py-8 border-b border-ivory-border flex justify-between items-center bg-ivory-surface/20">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
            <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
            {net.liveFeed}
          </h3>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">search</span>
            <input 
              type="text" 
              placeholder={net.search}
              className="bg-white border border-ivory-border rounded-xl pl-9 pr-4 py-2 text-xs font-bold outline-none focus:ring-2 ring-primary/10 w-64"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ivory-surface/50">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hash ID</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại giao thức</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá trị</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quốc gia</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-border">
              {transactions.map((tx, i) => (
                <tr key={i} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-6 font-mono text-xs font-bold text-primary">{tx.id}</td>
                  <td className="px-10 py-6">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">{tx.type}</span>
                  </td>
                  <td className="px-10 py-6 text-sm font-black text-slate-900 tracking-tight">{tx.value}</td>
                  <td className="px-10 py-6 text-sm font-bold text-slate-500">{tx.country}</td>
                  <td className="px-10 py-6 text-[10px] font-mono font-bold text-slate-400">{tx.time}</td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <span className={`size-1.5 rounded-full ${tx.status === 'FINALIZED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                       <span className={`text-[10px] font-black uppercase tracking-tighter ${tx.status === 'FINALIZED' ? 'text-emerald-600' : 'text-amber-600'}`}>{tx.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Network Infrastructure Map Simulation */}
      <div className="bg-slate-900 rounded-[48px] p-12 text-white shadow-2xl relative overflow-hidden h-[400px]">
         <div className="relative z-10">
            <h3 className="text-lg font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
               <span className="material-symbols-outlined text-primary">hub</span>
               Consensus Node Distribution
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { label: 'Bắc Mỹ', count: 2402, load: '42%' },
                 { label: 'Châu Âu', count: 3105, load: '68%' },
                 { label: 'Châu Á', count: 1845, load: '91%' },
                 { label: 'Châu Đại Dương', count: 751, load: '12%' }
               ].map((region) => (
                 <div key={region.label} className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{region.label}</p>
                    <p className="text-2xl font-black mb-4">{region.count}</p>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: region.load }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         
         <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/4 left-1/4 size-32 bg-primary rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/3 size-48 bg-emerald-500 rounded-full blur-[120px] animate-pulse delay-700"></div>
         </div>
      </div>
    </div>
  );
};

export default NetworkExplorer;
