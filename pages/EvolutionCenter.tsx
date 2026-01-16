
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { evolutionService, EvolutionReport, RuleProposal } from '../services/evolution';

const EvolutionCenter = () => {
  const { t } = useLanguage();
  const [report, setReport] = useState<EvolutionReport | null>(null);
  const [proposals, setProposals] = useState<RuleProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvolution = async () => {
      const data = await evolutionService.generateEvolutionAnalysis({
        totalCycles: 12,
        activeUsers: 8500,
        averageKpi: 94.2
      });
      setReport(data.report);
      setProposals(data.proposals);
      setIsLoading(false);
    };
    loadEvolution();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-violet-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Recursive Learning</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">AGENT: EVOLUTION_18 // FUTURE_STATE</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Tiến hóa & Học máy Hệ thống</h1>
          <p className="text-slate-500 mt-2 font-medium italic">"Lịch sử là bất biến, tương lai là không giới hạn."</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-ivory-border p-4 rounded-3xl flex items-center gap-4 shadow-sm">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maturity Score</p>
                <p className="text-xl font-black text-violet-600">{report?.maturityScore || '--'}/100</p>
              </div>
              <span className="material-symbols-outlined text-2xl text-violet-500">auto_mode</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Intelligence Report */}
        <div className="lg:col-span-8 space-y-8">
           
           <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm relative overflow-hidden">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-10 flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">insights</span>
                 Báo cáo Hành vi dài hạn (AI-18)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <div>
                       <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase mb-3">
                          <span>Tỷ lệ Trì trệ Vai trò (Stagnation)</span>
                          <span className="text-rose-500">{report?.stagnationRate}%</span>
                       </div>
                       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500" style={{ width: `${report?.stagnationRate}%` }} />
                       </div>
                       <p className="text-[9px] text-slate-400 mt-2 italic">Người dùng không thể thăng tiến qua 3 chu kỳ.</p>
                    </div>

                    <div>
                       <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase mb-3">
                          <span>Chỉ số Tập trung Giá trị (Concentration)</span>
                          <span className="text-amber-500">{report?.concentrationIndex}</span>
                       </div>
                       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${(report?.concentrationIndex || 0) * 100}%` }} />
                       </div>
                       <p className="text-[9px] text-slate-400 mt-2 italic">Chỉ số 0.3 là ngưỡng lý tưởng cho sự phi tập trung.</p>
                    </div>
                 </div>

                 <div className="bg-slate-50 rounded-[32px] p-8 border border-ivory-border">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Learning Insights</p>
                    <div className="space-y-4">
                       {report?.learningInsights.map((insight, i) => (
                         <div key={i} className="flex gap-3 text-xs font-medium text-slate-600 leading-relaxed">
                            <span className="text-primary font-black">»</span>
                            {insight}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-sm font-black uppercase tracking-widest text-violet-400 flex items-center gap-2">
                       <span className="material-symbols-outlined">description</span>
                       Đề xuất Cải tiến Quy tắc (Proposal v4.3)
                    </h3>
                    <span className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-[9px] font-black uppercase tracking-widest">Drafting State</span>
                 </div>

                 <div className="space-y-6">
                    {proposals.map(prop => (
                      <div key={prop.id} className="p-8 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 transition-all group">
                         <div className="flex justify-between items-start mb-6">
                            <div>
                               <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">{prop.targetParameter}</p>
                               <h4 className="text-xl font-black text-white tracking-tight">{prop.id}</h4>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-white/30 uppercase">Impact Projection</p>
                               <p className="text-sm font-black text-emerald-400">{prop.projectedImpact}</p>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-8 mb-6">
                            <div className="p-4 bg-black/30 rounded-2xl border border-white/5">
                               <p className="text-[9px] font-black text-white/40 uppercase mb-1">Hiện tại</p>
                               <p className="text-sm font-bold">{prop.currentValue}</p>
                            </div>
                            <div className="p-4 bg-violet-500/10 rounded-2xl border border-violet-500/20">
                               <p className="text-[9px] font-black text-violet-400 uppercase mb-1">Đề xuất</p>
                               <p className="text-sm font-bold">{prop.proposedValue}</p>
                            </div>
                         </div>

                         <p className="text-xs text-white/60 font-medium leading-relaxed italic">
                           "Reasoning: {prop.reasoning}"
                         </p>
                         
                         <div className="mt-8 flex gap-3">
                            <button className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-violet-600/20">
                               Vote to Support
                            </button>
                            <button className="px-6 py-3 bg-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">
                               Simulation Detail
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="absolute -bottom-24 -right-24 size-96 bg-violet-500/5 rounded-full blur-[100px] pointer-events-none"></div>
           </div>
        </div>

        {/* Right Column: Evolution Stats & Principles */}
        <div className="lg:col-span-4 space-y-8">
           
           <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Điểm Nghẽn Hệ thống (Bottlenecks)</h3>
              <div className="space-y-4">
                 {report?.bottlenecks.map((b, i) => (
                   <div key={i} className="flex gap-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                      <span className="material-symbols-outlined text-rose-500 text-sm">warning</span>
                      <p className="text-[11px] font-bold text-rose-700 leading-snug">{b}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-violet-600 rounded-[48px] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest mb-6">Nguyên tắc Tiến hóa</h4>
                 <ul className="space-y-4">
                    {[
                      { icon: 'history_edu', text: 'Sổ cái quá khứ là bất biến' },
                      { icon: 'biotech', text: 'Cải tiến dựa trên bằng chứng (Evidence-based)' },
                      { icon: 'psychology', text: 'Học máy liên tục (Continual Learning)' },
                      { icon: 'diversity_1', text: 'Đồng thuận cộng đồng > AI Auto-update' }
                    ].map((principle, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-medium text-white/80">
                         <span className="material-symbols-outlined text-white/50 text-sm">{principle.icon}</span>
                         {principle.text}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <span className="material-symbols-outlined text-[120px]">science</span>
              </div>
           </div>

           <div className="bg-ivory-surface border border-ivory-border rounded-[40px] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">System Health Projection</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Network Lifespan</span>
                    <span className="text-emerald-500 font-black">99+ Years</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Adaptability Index</span>
                    <span className="text-violet-600 font-black">HIGH</span>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default EvolutionCenter;
