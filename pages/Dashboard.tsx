
import React from 'react';
import { useLanguage } from '../App';

const Dashboard = () => {
  const { t } = useLanguage();
  const assets = [
    { name: 'USDT', balance: '1,240.50', color: 'bg-emerald-500' },
    { name: 'GOLD', balance: '42.15g', color: 'bg-amber-500' },
    { name: 'VND', balance: '2,500,000', color: 'bg-red-500' },
    { name: 'REWARD', balance: '850.00', color: 'bg-indigo-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t.dashboard.title}</h1>
          <p className="text-gray-500 font-medium">{t.dashboard.welcome}, Guardian 0x71...2a</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center px-8">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.dashboard.role}</p>
            <p className="text-emerald-700 font-black">OPERATOR</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center px-8">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.dashboard.kpi}</p>
            <p className="text-slate-900 font-black">94%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {assets.map((asset) => (
          <div key={asset.name} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className={`absolute top-0 right-0 w-1.5 h-full ${asset.color}`} />
            <p className="text-xs font-black text-gray-400 uppercase mb-2">{asset.name}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">{asset.balance}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-black text-slate-900 mb-8 border-b pb-4">{t.dashboard.activity}</h3>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    +
                  </div>
                  <div>
                    <p className="font-black text-slate-800 tracking-tight">Value Distribution Received</p>
                    <p className="text-xs text-gray-400 font-mono">ID: UV-92{81-i}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-emerald-600 text-lg">+12.40 USDT</p>
                  <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">2h ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-900 rounded-[32px] shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-black mb-4 uppercase tracking-tighter">{t.dashboard.progress}</h3>
            <p className="text-emerald-300 text-sm mb-10 leading-relaxed font-medium">{t.dashboard.recalc}</p>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest opacity-80">
                  <span>Validation Points</span>
                  <span>140/150</span>
                </div>
                <div className="w-full bg-emerald-950 rounded-full h-2 border border-emerald-800">
                  <div className="bg-emerald-400 h-2 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: '93%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest opacity-80">
                  <span>Creation Value</span>
                  <span>4,2k/5k</span>
                </div>
                <div className="w-full bg-emerald-950 rounded-full h-2 border border-emerald-800">
                  <div className="bg-emerald-400 h-2 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: '84%' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-30" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
