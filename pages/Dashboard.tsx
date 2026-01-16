import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../App';
import { emergencyService } from '../services/emergency';

const StatusPill = ({ label, status }: { label: string, status: 'ONLINE' | 'WARNING' | 'ALERT' }) => {
  const colors = {
    ONLINE: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    WARNING: 'bg-amber-500/10 text-amber-600 border-amber-200',
    ALERT: 'bg-rose-500/10 text-rose-600 border-rose-200'
  };
  return (
    <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${colors[status]}`}>
      <span className={`size-1.5 rounded-full ${status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : status === 'WARNING' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
      {label}
    </div>
  );
};

const ProtocolCycleStepper = ({ currentStage, stages }: { currentStage: string, stages: any[] }) => {
  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between relative mb-8">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />
        
        {stages.map((stage, idx) => {
          const isCompleted = idx < stages.findIndex(s => s.id === currentStage);
          const isActive = stage.id === currentStage;
          
          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center">
              <div className={`size-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${
                isCompleted ? 'bg-emerald-500 text-white border-emerald-100 dark:border-emerald-900/30' :
                isActive ? 'bg-primary text-white border-blue-100 dark:border-blue-900/30 shadow-lg shadow-primary/20 scale-110' :
                'bg-white dark:bg-slate-900 text-slate-300 border-slate-50 dark:border-slate-800'
              }`}>
                <span className="material-symbols-outlined text-lg">{stage.icon}</span>
              </div>
              <div className="absolute top-12 whitespace-nowrap text-center">
                <p className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {stage.label}
                </p>
                {isActive && (
                  <div className="flex items-center gap-1 justify-center mt-1">
                    <span className="size-1 bg-primary rounded-full animate-ping"></span>
                    <span className="text-[7px] font-bold text-primary">{stage.progress}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { t } = useLanguage();
  const emergency = emergencyService.getEmergencyState();
  
  // Giả lập dữ liệu quản trị
  const stats = {
    tps: '12,482',
    nodes: '8,103',
    totalValue: '$4.21B',
    activeDisputes: 12,
    pendingApps: 3,
    ledgerReconciled: true
  };

  const cycleStages = [
    { id: 'CREATE', label: t.cycle.create, progress: 100, icon: 'add_box' },
    { id: 'VALIDATE', label: t.cycle.validate, progress: 42, icon: 'verified_user' },
    { id: 'DISTRIBUTE', label: t.cycle.distribute, progress: 0, icon: 'payments' },
    { id: 'RENEW', label: t.cycle.renew, progress: 0, icon: 'refresh' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-700">
      
      {/* Top Bar: System Status & Cycle */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 bg-white dark:bg-slate-900 border border-ivory-border dark:border-slate-800 p-10 rounded-[48px] shadow-sm">
        <div className="space-y-1 min-w-[280px]">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Mission Control</h1>
            <StatusPill label="v4.4 Stable" status={emergency.isFrozen ? 'ALERT' : 'ONLINE'} />
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global Mainnet Node Operator Console</p>
        </div>

        <div className="flex-1 w-full pt-2">
           <div className="flex justify-between mb-6 px-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Cycle Progression (Cycle #12)</p>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Mode: {emergency.isFrozen ? 'HALTED' : 'FLOWING'}</p>
           </div>
           <ProtocolCycleStepper currentStage="VALIDATE" stages={cycleStages} />
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Section 1: Economic Integrity */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-slate-900 text-white rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                 <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Total Value Locked (TVL)</p>
                    <h2 className="text-6xl font-black tracking-tighter">{stats.totalValue}</h2>
                 </div>
                 <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div>
                       <p className="text-[9px] font-black text-white/40 uppercase mb-1">Creation Velocity</p>
                       <p className="text-lg font-bold text-emerald-400">+$2.1M <span className="text-[10px] font-normal opacity-50">/hr</span></p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-white/40 uppercase mb-1">Network TPS</p>
                       <p className="text-lg font-bold text-primary">{stats.tps}</p>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-24 -right-24 size-80 bg-primary/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
           </div>

           <div className="bg-white dark:bg-slate-900 border border-ivory-border dark:border-slate-800 rounded-[48px] p-10 shadow-sm flex flex-col justify-between">
              <div>
                 <div className="flex justify-between items-start mb-10">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                       <span className="material-symbols-outlined text-emerald-500">verified_user</span>
                       Ledger Health
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">SHA-256 Verified</span>
                 </div>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-ivory-border dark:border-slate-800">
                       <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Reconciliation Matrix</span>
                       <span className="text-xs font-black text-emerald-600 uppercase">Balanced</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-ivory-border dark:border-slate-800">
                       <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Validation Buffer</span>
                       <span className="text-xs font-black text-slate-900 dark:text-white uppercase">Optimal (12m)</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Infrastructure Latency</span>
                       <span className="text-xs font-black text-slate-900 dark:text-white uppercase">12ms Global</span>
                    </div>
                 </div>
              </div>
              <button className="mt-8 w-full py-4 bg-slate-50 dark:bg-slate-800 border border-ivory-border dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                 Download Full Audit Log
              </button>
           </div>
        </div>

        {/* Section 2: Administrative Alerts */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white dark:bg-slate-900 border border-ivory-border dark:border-slate-800 rounded-[48px] p-8 shadow-sm h-full flex flex-col">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Pending Admin Actions</h3>
              <div className="flex-1 space-y-4">
                 {[
                   { label: 'Active Disputes', count: stats.activeDisputes, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/5', icon: 'gavel' },
                   { label: 'Partner App Reviews', count: stats.pendingApps, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/5', icon: 'hub' },
                   { label: 'System evolution proposals', count: 1, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/5', icon: 'auto_mode' }
                 ].map((action, i) => (
                   <div key={i} className={`flex items-center justify-between p-4 ${action.bg} rounded-3xl border border-transparent hover:border-ivory-border dark:hover:border-slate-700 transition-all cursor-pointer group`}>
                      <div className="flex items-center gap-4">
                         <span className={`material-symbols-outlined ${action.color}`}>{action.icon}</span>
                         <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{action.label}</span>
                      </div>
                      <span className={`text-lg font-black ${action.color} group-hover:scale-110 transition-transform`}>{action.count}</span>
                   </div>
                 ))}
              </div>
              <div className="mt-8 pt-6 border-t border-ivory-border dark:border-slate-800">
                 <p className="text-[10px] text-slate-400 italic leading-relaxed">"System reliability depends on timely manual oversight of edge cases."</p>
              </div>
           </div>
        </div>

        {/* Section 3: Regional & Asset Breakdown */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
           
           <div className="bg-white dark:bg-slate-900 border border-ivory-border dark:border-slate-800 rounded-[48px] p-10 shadow-sm overflow-hidden relative">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">Network Asset Diversity</h3>
              <div className="flex items-end gap-6 h-40 mb-10">
                 {[
                   { label: 'USDT', val: 55, color: 'bg-emerald-500' },
                   { label: 'GOLD', val: 30, color: 'bg-amber-500' },
                   { label: 'VND', val: 10, color: 'bg-rose-500' },
                   { label: 'REWARD', val: 5, color: 'bg-primary' }
                 ].map(asset => (
                   <div key={asset.label} className="flex-1 flex flex-col items-center gap-3">
                      <div className={`w-full rounded-t-xl ${asset.color}`} style={{ height: `${asset.val}%` }} />
                      <span className="text-[9px] font-black uppercase text-slate-500">{asset.label}</span>
                   </div>
                 ))}
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-ivory-border dark:border-slate-700 flex items-center justify-between">
                 <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Liquidity Health Index</span>
                 <span className="text-xs font-black text-emerald-600">0.92 EXCELLENT</span>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 border border-ivory-border dark:border-slate-800 rounded-[48px] p-10 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">Top Regional Nodes</h3>
              <div className="space-y-8">
                 {[
                   { region: 'Vietnam (VN)', load: 92, status: 'Active' },
                   { region: 'Germany (DE)', load: 68, status: 'Active' },
                   { region: 'USA (US)', load: 45, status: 'Active' }
                 ].map(r => (
                   <div key={r.region} className="space-y-2">
                      <div className="flex justify-between items-baseline px-1">
                         <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{r.region}</span>
                         <span className="text-[10px] font-black text-slate-400">{r.load}% Load</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-slate-900 dark:bg-primary" style={{ width: `${r.load}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
              <button className="mt-10 w-full text-[10px] font-black text-primary uppercase tracking-widest flex items-center justify-center gap-2 hover:gap-3 transition-all">
                 View Node Network <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
           </div>

           <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
                 <span className="material-symbols-outlined">terminal</span>
                 System Pulse
              </h3>
              <div className="space-y-4 font-mono text-[10px] opacity-70 leading-relaxed max-h-[160px] overflow-y-auto scrollbar-hide">
                 <p className="flex gap-4 border-l border-white/10 pl-4"><span className="text-white/20">22:45:01</span> <span>SHIELD_NODE_08: Batch #148 synchronized.</span></p>
                 <p className="flex gap-4 border-l border-white/10 pl-4"><span className="text-white/20">22:44:52</span> <span>AI-GATEWAY: Routing payload to LOCAL_LLAMA (Low Cost).</span></p>
                 <p className="flex gap-4 border-l border-white/10 pl-4"><span className="text-white/20">22:44:30</span> <span className="text-emerald-400">LEDGER: Merkle Root proof verified for Block 148201.</span></p>
                 <p className="flex gap-4 border-l border-white/10 pl-4"><span className="text-white/20">22:44:12</span> <span>COMPLIANCE: Tax rules updated for Japan (JP) profile.</span></p>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;