
import React from 'react';
import { useLanguage } from '../App';

const Analytics = () => {
  const { t } = useLanguage();
  const an = t.analytics;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase">{an.title}</h1>
          <p className="text-slate-500 font-medium">{an.subtitle}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-ivory-border dark:border-slate-800 rounded-2xl px-6 py-3 flex items-center gap-3">
          <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Live Updates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-ivory-border dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{an.distribution}</p>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold">USDT Flows</span>
              <span className="text-2xl font-black text-primary">$2.4M</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[72%]"></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Network Velocity</p>
          <div className="flex items-center gap-4">
            <span className="text-5xl font-black tracking-tighter">1.4s</span>
            <div className="flex flex-col">
              <span className="text-emerald-400 font-bold text-xs">+12%</span>
              <span className="text-[10px] opacity-40 font-black">vs last cycle</span>
            </div>
          </div>
          <div className="absolute -bottom-12 -right-12 size-40 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-ivory-border dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{an.efficiency}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black">99.8%</span>
            <span className="text-xs font-bold text-emerald-500">Optimal</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-ivory-border dark:border-slate-800 shadow-sm">
         <h3 className="text-lg font-black uppercase tracking-widest mb-8">Hệ số Phân phối Giá trị theo Vai trò</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Creator', rate: '60%', color: 'bg-blue-500' },
              { label: 'Operator', rate: '25%', color: 'bg-emerald-500' },
              { label: 'Guide', rate: '10%', color: 'bg-amber-500' },
              { label: 'System Fund', rate: '5%', color: 'bg-rose-500' }
            ].map(r => (
              <div key={r.label} className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-black uppercase tracking-tighter text-slate-400">{r.label}</span>
                  <span className="text-sm font-black">{r.rate}</span>
                </div>
                <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${r.color}`} style={{ width: r.rate }}></div>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Analytics;
