
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { rulesetService, RuleSet } from '../services/ruleset';

const RuleSetManager = () => {
  const { t } = useLanguage();
  const [ruleset, setRuleset] = useState<RuleSet | null>(null);
  const [simAmount, setSimAmount] = useState(10000);
  const [activeScenario, setActiveScenario] = useState<'FULL' | 'PARTIAL'>('FULL');

  useEffect(() => {
    setRuleset(rulesetService.getLatestRuleSet());
  }, []);

  const simulation = ruleset && rulesetService.simulateScenario(simAmount, activeScenario);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Rule Engine v4.4</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">MANAGER: RULESET_CORE // IMMUTABLE_LOGIC</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">Quản lý RuleSet & Ma trận</h1>
          <p className="text-slate-500 mt-2 font-medium italic">"Công bằng hóa lợi ích thông qua thuật toán phân phối đệ quy."</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-ivory-border p-4 rounded-3xl flex items-center gap-4 shadow-sm">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Ceiling</p>
                <p className="text-xl font-black text-amber-600">{ruleset?.ceiling}%</p>
              </div>
              <span className="material-symbols-outlined text-2xl text-amber-500">lock_open</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Matrix Configuration & Simulation */}
        <div className="lg:col-span-8 space-y-8">
           
           <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm overflow-hidden relative">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">analytics</span>
                    Mô phỏng Phân phối v4.4.0
                 </h3>
                 <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setActiveScenario('FULL')}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeScenario === 'FULL' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
                    >
                      FULL (F1+F2+F3)
                    </button>
                    <button 
                      onClick={() => setActiveScenario('PARTIAL')}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeScenario === 'PARTIAL' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
                    >
                      SMALL (F1+F2)
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                 {[
                   { id: 'f1', label: 'F1 (Creator)', val: activeScenario === 'FULL' ? ruleset?.matrices.full.f1 : ruleset?.matrices.partial.f1, color: 'bg-blue-500' },
                   { id: 'f2', label: 'F2 (Operator)', val: activeScenario === 'FULL' ? ruleset?.matrices.full.f2 : ruleset?.matrices.partial.f2, color: 'bg-emerald-500' },
                   { id: 'f3', label: 'F3 (Guide)', val: activeScenario === 'FULL' ? ruleset?.matrices.full.f3 : ruleset?.matrices.partial.f3, color: 'bg-amber-500' },
                   { id: 'fund', label: 'System Fund', val: activeScenario === 'FULL' ? ruleset?.matrices.full.fund : ruleset?.matrices.partial.fund, color: 'bg-rose-500' }
                 ].map(m => (
                   <div key={m.id} className="p-6 bg-slate-50 border border-ivory-border rounded-3xl group hover:bg-white hover:shadow-lg transition-all">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                      <p className="text-2xl font-black text-slate-900">{m.val}%</p>
                      <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 mt-2 ${m.color}`}></div>
                   </div>
                 ))}
              </div>

              <div className="bg-slate-900 rounded-[32px] p-8 text-white">
                 <div className="flex justify-between items-center mb-8">
                    <p className="text-sm font-black uppercase tracking-widest text-primary">Kết quả mô phỏng (V)</p>
                    <input 
                      type="number" 
                      value={simAmount}
                      onChange={(e) => setSimAmount(Number(e.target.value))}
                      className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm font-black w-32 outline-none focus:ring-2 ring-primary"
                    />
                 </div>
                 <div className="space-y-4 font-mono">
                    <div className="flex justify-between text-xs">
                       <span className="text-white/40 uppercase">Thù lao F1:</span>
                       <span className="text-emerald-400 font-bold">{simulation?.f1_payout.toLocaleString()} V</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="text-white/40 uppercase">Thù lao F2:</span>
                       <span className="text-emerald-400 font-bold">{simulation?.f2_payout.toLocaleString()} V</span>
                    </div>
                    {activeScenario === 'FULL' && (
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40 uppercase">Thù lao F3:</span>
                        <span className="text-emerald-400 font-bold">{simulation?.f3_payout.toLocaleString()} V</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs pt-4 border-t border-white/10">
                       <span className="text-white/40 uppercase">Tổng thù lao (30%):</span>
                       <span className="text-primary font-black">{simulation?.total.toLocaleString()} V</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Royalty Clarity Section */}
           <div className="bg-amber-50 border border-amber-100 rounded-[48px] p-10 relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-lg font-black text-amber-900 mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined">workspace_premium</span>
                    Cơ chế Royalty (Truyền thừa v4.4)
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <p className="text-sm text-amber-800 font-medium leading-relaxed">
                          Khi một <b>F3</b> thăng tiến lên <b>F2</b>, hệ thống ghi nhận công lao của người bảo trợ (F1) và người quản lý trực tiếp (F2 cũ).
                       </p>
                       <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-xs font-bold text-amber-900">
                             <span className="material-symbols-outlined text-sm">arrow_upward</span>
                             F1 Top: +{ruleset?.royalty.f1_bonus}% bonus
                          </li>
                          <li className="flex items-center gap-2 text-xs font-bold text-amber-900">
                             <span className="material-symbols-outlined text-sm">arrow_upward</span>
                             Old F2: +{ruleset?.royalty.old_f2_bonus}% bonus
                          </li>
                       </ul>
                    </div>
                    <div className="bg-white/50 border border-amber-200 rounded-3xl p-6 italic text-[11px] text-amber-800 font-medium leading-relaxed">
                       "Nguồn bonus: Trích từ % thù lao của F2 mới được tạo ra, không làm vượt trần 30% của toàn bộ block giá trị."
                    </div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 p-10 opacity-10">
                 <span className="material-symbols-outlined text-[140px] text-amber-600">military_tech</span>
              </div>
           </div>
        </div>

        {/* Right: Decision Table & Migration */}
        <div className="lg:col-span-4 space-y-8">
           
           <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Bảng Quyết định Thăng tiến</h3>
              <div className="space-y-6">
                 <div>
                    <p className="text-[10px] font-black text-primary uppercase mb-3">F3 ➔ F2 Upgrade</p>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Revenue</span>
                          <span className="font-black">{ruleset?.promotion.f3_to_f2.revenue} V</span>
                       </div>
                       <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Customers</span>
                          <span className="font-black">{ruleset?.promotion.f3_to_f2.customers}</span>
                       </div>
                       <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Val Quality</span>
                          <span className="font-black">{ruleset?.promotion.f3_to_f2.valQuality}%</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="pt-6 border-t border-ivory-border">
                    <p className="text-[10px] font-black text-rose-500 uppercase mb-3">Demotion Trigger</p>
                    <p className="text-xs font-bold text-slate-700 italic">"Fail KPI &lt; 90% in 2 consecutive cycles."</p>
                 </div>
              </div>
           </div>

           <div className="bg-primary rounded-[48px] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest mb-6">Changelog v4.4.0</h4>
                 <div className="space-y-4 h-48 overflow-y-auto scrollbar-hide">
                    {[
                      'Adjusted F1 rate (+1%) to reward creation density.',
                      'Decreased F3 rate (-2%) for network sustainability.',
                      'Implemented Royalty bridge for F3->F2 promotions.',
                      'Stabilized System Fund at 2.5% for risk buffer.',
                      'Dynamic Validation Threshold updated to 5 peers.'
                    ].map((log, i) => (
                      <p key={i} className="text-[11px] font-medium text-white/70 flex gap-2">
                        <span className="text-white/30">•</span> {log}
                      </p>
                    ))}
                 </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <span className="material-symbols-outlined text-[120px]">history_edu</span>
              </div>
           </div>

           <div className="bg-ivory-surface border border-ivory-border rounded-[40px] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Migration Notes</h3>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic">
                 "Các nút F2 cũ cần được thông báo về việc tái cấu trúc Royalty trước khi chu kỳ tiếp theo bắt đầu. Không ảnh hưởng đến các Ledger đã đóng."
              </p>
           </div>

        </div>
      </div>
    </div>
  );
};

export default RuleSetManager;
