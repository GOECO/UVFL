
import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../App';

const Dashboard = () => {
  const { t } = useLanguage();
  
  const targetDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }, []);

  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false
  });

  const [kpiValue, setKpiValue] = useState(94.5); 
  const maintenanceThreshold = 90.0; 
  const promotionThreshold = 98.0;   
  const [currentStage, setCurrentStage] = useState<'CREATE' | 'VALIDATE' | 'DISTRIBUTE' | 'RENEW'>('VALIDATE');

  const assets = [
    { name: 'USDT', balance: '1,240.50', color: 'bg-emerald-500', icon: 'payments' },
    { name: 'GOLD', balance: '42.15g', color: 'bg-amber-500', icon: 'conditions' },
    { name: 'VND', balance: '2,500,000', color: 'bg-red-500', icon: 'account_balance' },
    { name: 'REWARD', balance: '850.00', color: 'bg-indigo-500', icon: 'token' },
  ];

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false
      });
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const cycleStages = [
    { id: 'CREATE', label: t.cycle.create, icon: 'add_circle' },
    { id: 'VALIDATE', label: t.cycle.validate, icon: 'verified_user' },
    { id: 'DISTRIBUTE', label: t.cycle.distribute, icon: 'payments' },
    { id: 'RENEW', label: t.cycle.renew, icon: 'auto_mode' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-700">
      
      {/* 4-Stage Cycle Stepper */}
      <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">{t.cycle.currentStage}</h3>
            <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Mainnet v4.4 Stable</span>
         </div>
         <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between relative px-4">
            <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-100 hidden md:block">
               <div className="h-full bg-primary transition-all duration-1000" style={{ width: '40%' }}></div>
            </div>
            {cycleStages.map((stage, i) => (
              <div key={stage.id} className="relative z-10 flex flex-col items-center gap-3">
                 <div className={`size-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${
                   currentStage === stage.id ? 'bg-primary text-white border-primary/20 shadow-lg shadow-primary/20 scale-110' : 
                   (i < 1 ? 'bg-emerald-500 text-white border-emerald-100' : 'bg-white text-slate-300 border-slate-50')
                 }`}>
                    <span className="material-symbols-outlined text-lg">{stage.icon}</span>
                 </div>
                 <p className={`text-[10px] font-black uppercase tracking-widest ${currentStage === stage.id ? 'text-primary' : 'text-slate-400'}`}>
                    {stage.label}
                 </p>
              </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KPI & Role Insight */}
        <div className="lg:col-span-8 bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm flex flex-col md:flex-row gap-12 relative overflow-hidden">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" 
                        strokeDasharray="502" strokeDashoffset={502 - (502 * kpiValue / 100)}
                        className="text-primary transition-all duration-1000" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black tracking-tighter text-slate-900">{kpiValue}%</span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.dashboard.kpi}</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full flex items-center gap-2">
               <span className="material-symbols-outlined text-sm">verified</span>
               <span className="text-[10px] font-black uppercase tracking-widest">{t.dashboard.statusSafe}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-8">
             <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-4">{t.roles.f2}</h2>
                <p className="text-slate-500 font-medium leading-relaxed italic">
                  "Sắp thăng tiến: Cần thêm 3.5% KPI để đạt bậc F3 - Guide trong chu kỳ tới."
                </p>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 border border-ivory-border rounded-3xl">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Dự kiến thù lao</p>
                   <p className="text-xl font-black text-slate-900">4,250 <span className="text-xs text-slate-300">V</span></p>
                </div>
                <div className="p-5 bg-amber-50 border border-amber-100 rounded-3xl">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Tiền thưởng (Royalty)</p>
                   <p className="text-xl font-black text-amber-600">+1.0%</p>
                </div>
             </div>
          </div>
          
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <span className="material-symbols-outlined text-[200px]">military_tech</span>
          </div>
        </div>

        {/* Recalculation Countdown */}
        <div className="lg:col-span-4 bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl flex flex-col justify-between">
           <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
                 <span className="material-symbols-outlined">timer</span>
                 {t.dashboard.recalcTitle}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { v: timeLeft.days, l: 'Days' },
                   { v: timeLeft.hours, l: 'Hours' },
                   { v: timeLeft.minutes, l: 'Mins' },
                   { v: timeLeft.seconds, l: 'Secs' }
                 ].map((u, i) => (
                   <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
                      <p className="text-2xl font-black leading-none">{u.v.toString().padStart(2, '0')}</p>
                      <p className="text-[8px] font-black text-white/40 uppercase mt-1">{u.l}</p>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-xs text-white/60 font-medium leading-relaxed italic">
                "{t.dashboard.recalc}"
              </p>
           </div>
        </div>

      </div>

      {/* Asset Tracking Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {assets.map((asset) => (
          <div key={asset.name} className="bg-white p-8 rounded-[40px] border border-ivory-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${asset.color}`}>
                <span className="material-symbols-outlined text-xl">{asset.icon}</span>
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{asset.name}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{asset.balance}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
