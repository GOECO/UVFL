
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../App';
import { assetEngineService, FXSnapshot, AssetType } from '../../services/asset-engine';

const AssetConversionEngine = () => {
  const { t } = useLanguage();
  const snapshots = useMemo(() => assetEngineService.getSnapshots(), []);
  const logs = useMemo(() => assetEngineService.getConversionLogs(), []);
  
  const [activeSnapshot, setActiveSnapshot] = useState<FXSnapshot>(snapshots[0]);
  const [calcInput, setCalcInput] = useState({ amount: 1, from: 'USDT' as AssetType, to: 'NATIONAL' as AssetType });

  const previewResult = useMemo(() => {
    return assetEngineService.calculateConversion(calcInput.amount, calcInput.from, calcInput.to, activeSnapshot);
  }, [calcInput, activeSnapshot]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Policy Warning Banner */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-[32px] p-6 flex items-center gap-6 shadow-sm">
        <div className="size-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
          <span className="material-symbols-outlined text-3xl">gavel</span>
        </div>
        <div>
          <h4 className="text-amber-900 font-black uppercase tracking-tight text-sm mb-1">Protocol Notice: Administrative Conversion Only</h4>
          <p className="text-amber-800 text-xs font-medium leading-relaxed italic">
            Hệ thống này chỉ phục vụ mục đích hạch toán và ước tính thuế. UVFL Global không phải là sàn giao dịch thương mại (Trading Exchange). Mọi hành vi đầu cơ tỷ giá đều bị ngăn chặn bởi logic hợp đồng thông minh.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FX Snapshots Table */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
              <div className="px-10 py-8 border-b border-ivory-border flex justify-between items-center bg-ivory-surface/20">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
                   <span className="material-symbols-outlined text-primary">history</span>
                   FX Rate Snapshots (Bản chụp tỷ giá)
                 </h3>
                 <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:scale-105 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">sync</span>
                    Sync New Snapshot
                 </button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-ivory-surface/50 border-b border-ivory-border">
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Timestamp</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">USDT / Fiat</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">GOLD / Fiat</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-ivory-border">
                       {snapshots.map(sn => (
                         <tr key={sn.id} 
                             onClick={() => setActiveSnapshot(sn)}
                             className={`group cursor-pointer transition-colors ${activeSnapshot.id === sn.id ? 'bg-primary/5' : 'hover:bg-slate-50'}`}>
                            <td className="px-10 py-6">
                               <p className="text-xs font-black text-slate-900 tracking-tight mb-1 uppercase">{sn.id}</p>
                               <p className="text-[10px] font-bold text-slate-400">{sn.timestamp}</p>
                            </td>
                            <td className="px-10 py-6">
                               <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase">{sn.source}</span>
                            </td>
                            <td className="px-10 py-6 font-mono text-sm font-bold text-slate-700">{sn.rates['USDT/FIAT'].toLocaleString()} {sn.currency}</td>
                            <td className="px-10 py-6 font-mono text-sm font-bold text-slate-700">{sn.rates['GOLD/FIAT'].toLocaleString()} {sn.currency}</td>
                            <td className="px-10 py-6 text-right">
                               <span className={`size-2 rounded-full inline-block ${activeSnapshot.id === sn.id ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-200'}`}></span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Conversion Audit Logs */}
           <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Recent Conversion Activities (Immutable)</h3>
              <div className="space-y-4">
                 {logs.map(log => (
                   <div key={log.id} className="flex items-center justify-between p-6 bg-slate-50 border border-ivory-border rounded-3xl group">
                      <div className="flex items-center gap-6">
                         <div className="size-12 rounded-2xl bg-white border border-ivory-border flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined">analytics</span>
                         </div>
                         <div>
                            <p className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1">
                               {log.amount} {log.fromAsset} ➔ {log.result.toLocaleString()} {log.toAsset}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Snapshot: {log.snapshotId}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-mono font-bold text-slate-500">{log.timestamp}</p>
                         <span className="text-[9px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded font-black">AUDITED</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Conversion Engine / Preview Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           
           <div className="bg-slate-900 text-white rounded-[48px] p-8 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <span className="material-symbols-outlined text-primary text-2xl">calculate</span>
                    <h4 className="text-sm font-black uppercase tracking-widest text-primary">Conversion Preview</h4>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Input Amount</label>
                       <div className="flex gap-2">
                          <input 
                            type="number"
                            value={calcInput.amount}
                            onChange={(e) => setCalcInput({...calcInput, amount: Number(e.target.value)})}
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-xl font-black outline-none focus:ring-2 ring-primary"
                          />
                          <select 
                            value={calcInput.from}
                            onChange={(e) => setCalcInput({...calcInput, from: e.target.value as AssetType})}
                            className="bg-white/5 border border-white/10 rounded-2xl px-4 text-xs font-black outline-none appearance-none"
                          >
                            <option value="USDT">USDT</option>
                            <option value="GOLD">GOLD</option>
                            <option value="NATIONAL">NATIONAL</option>
                            <option value="REWARD">REWARD</option>
                          </select>
                       </div>
                    </div>

                    <div className="flex justify-center">
                       <span className="material-symbols-outlined text-white/20 text-4xl">south</span>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Target Asset</label>
                       <select 
                          value={calcInput.to}
                          onChange={(e) => setCalcInput({...calcInput, to: e.target.value as AssetType})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-black outline-none appearance-none"
                        >
                          <option value="NATIONAL">NATIONAL (VND)</option>
                          <option value="USDT">USDT</option>
                          <option value="GOLD">GOLD</option>
                          <option value="REWARD">REWARD</option>
                       </select>
                    </div>

                    <div className="p-8 bg-primary/10 border-2 border-primary/20 rounded-[32px] text-center">
                       <p className="text-[10px] font-black text-primary uppercase mb-2 tracking-widest">Estimated Value</p>
                       <p className="text-4xl font-black tracking-tighter">{previewResult.toLocaleString()}</p>
                       <p className="text-xs font-bold text-white/40 mt-1">{calcInput.to === 'NATIONAL' ? activeSnapshot.currency : calcInput.to}</p>
                    </div>

                    <div className="text-center pt-4">
                       <p className="text-[9px] text-white/30 italic uppercase tracking-tighter">
                         Using Snapshot: {activeSnapshot.id}
                       </p>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 size-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
           </div>

           <div className="bg-ivory-surface border border-ivory-border rounded-[40px] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Asset Constraints</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">REWARD_TOKEN Cash-out</span>
                    <span className="text-rose-500 font-black uppercase text-[9px] bg-rose-50 px-2 py-0.5 rounded border border-rose-100">STRICTLY BLOCKED</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Max Volatility Gap</span>
                    <span className="text-slate-900 font-black">2.0% (Auto-freeze)</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Price Override</span>
                    <span className="text-rose-500 font-black uppercase text-[9px]">DISABLED</span>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-ivory-border rounded-[40px] p-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Oracle Connectivity</h4>
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                 <span className="material-symbols-outlined text-emerald-500">router</span>
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-emerald-700 uppercase">Binance API</p>
                    <p className="text-[9px] font-bold text-emerald-600/70">LATENCY: 42ms • STATUS: ACTIVE</p>
                 </div>
                 <span className="size-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default AssetConversionEngine;
