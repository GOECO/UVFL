
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { governanceService, GovernanceProposal, EthicsAudit } from '../services/governance';

const GovernanceHub = () => {
  const { t } = useLanguage();
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [audit, setAudit] = useState<EthicsAudit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const auditResult = await governanceService.conductEthicsAudit({});
      setAudit(auditResult);
      setProposals(governanceService.getActiveProposals());
      setIsLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-teal-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Ethical Governance</span>
            <span className="text-slate-400 text-xs font-bold font-mono">AGENT: GOVERNANCE_12</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Quản trị & Đạo đức Hệ thống</h1>
          <p className="text-slate-500 mt-2 font-medium italic">"Mã nguồn là công lý. Sự minh bạch là niềm tin."</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white border border-ivory-border px-6 py-3 rounded-2xl shadow-sm text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Điểm Công bằng</p>
              <p className="text-xl font-black text-teal-600">{audit?.fairnessScore || '--'}%</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ethics Report Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white rounded-[48px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-teal-400 mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined">balance</span>
                Báo cáo Đạo đức (Audit-12)
              </h3>
              
              <div className="space-y-8">
                <div>
                   <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase mb-2">
                      <span>Hệ số Gini (Bình đẳng)</span>
                      <span>{audit?.giniCoefficient || '0.28'}</span>
                   </div>
                   <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400" style={{ width: `${(1 - (audit?.giniCoefficient || 0.28)) * 100}%` }} />
                   </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                   <p className="text-xs text-white/70 italic leading-relaxed">
                     "{audit?.socialImpactSummary || 'Đang phân tích tác động xã hội...'}"
                   </p>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Khuyến nghị Đạo đức</p>
                  {audit?.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-3 text-xs font-medium text-white/80">
                      <span className="text-teal-400">●</span>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-24 -right-24 size-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          </div>

          <div className="bg-white border border-ivory-border rounded-[40px] p-8">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Nguyên tắc Quản trị</h4>
             <ul className="space-y-6">
                {[
                  { title: 'Incorruptible Logic', desc: 'Mã nguồn là luật pháp tối thượng.' },
                  { title: 'Meritocratic Growth', desc: 'Thăng tiến dựa trên KPI thực tế.' },
                  { title: 'Peer Sovereignty', desc: 'Quyền lực thuộc về các nút xác thực.' }
                ].map((p, i) => (
                  <li key={i}>
                    <p className="text-sm font-black text-slate-900 leading-none mb-2">{p.title}</p>
                    <p className="text-xs text-slate-500 font-medium">{p.desc}</p>
                  </li>
                ))}
             </ul>
          </div>
        </div>

        {/* Change Proposals */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  <span className="material-symbols-outlined text-teal-600">history_edu</span>
                  Đề xuất Cải tiến Hệ thống (Proposals)
                </h3>
                <button className="px-6 py-2 bg-teal-50 text-teal-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-100 transition-all">
                  Tạo Đề xuất Mới
                </button>
             </div>

             <div className="space-y-6">
                {proposals.map(prop => (
                  <div key={prop.id} className="p-8 border border-ivory-border rounded-[32px] hover:shadow-xl hover:border-teal-100 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                       <div>
                          <div className="flex items-center gap-3 mb-2">
                             <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded">{prop.category}</span>
                             <span className="text-[10px] font-mono text-slate-400">{prop.id}</span>
                          </div>
                          <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-teal-600 transition-colors">{prop.title}</h4>
                       </div>
                       <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                         prop.status === 'VOTING' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                       }`}>
                         {prop.status}
                       </div>
                    </div>
                    
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 relative z-10">
                      {prop.description}
                    </p>

                    <div className="flex items-center justify-between relative z-10">
                       <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black text-slate-400 uppercase">Impact Score</span>
                             <span className="text-sm font-black text-teal-600">{prop.impactScore}%</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black text-slate-400 uppercase">Proposer</span>
                             <span className="text-sm font-black text-slate-800">{prop.proposer}</span>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:scale-105 transition-all">
                            Witness / Vote
                          </button>
                       </div>
                    </div>

                    <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-300 pointer-events-none group-hover:text-teal-500 transition-colors">
                       <span className="material-symbols-outlined text-6xl">verified</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-teal-50 border border-teal-100 rounded-[48px] p-10 relative overflow-hidden">
             <div className="relative z-10 max-w-2xl">
                <h3 className="text-lg font-black text-teal-900 mb-4 tracking-tight">Tính bất biến của Quy tắc</h3>
                <p className="text-sm text-teal-700 font-medium leading-relaxed mb-8">
                  Mọi thay đổi chỉ có hiệu lực từ chu kỳ tiếp theo sau khi đạt ngưỡng đồng thuận 66.6%. Lịch sử dòng chảy giá trị (Past Ledger) là tuyệt đối không thể sửa đổi, đảm bảo tính toàn vẹn vĩnh cửu của hệ sinh thái.
                </p>
                <div className="flex gap-4">
                   <button className="px-6 py-3 bg-teal-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-600/20">
                     Xem Thư viện Quy tắc (v4.2)
                   </button>
                </div>
             </div>
             <div className="absolute top-0 right-0 p-10 opacity-10">
                <span className="material-symbols-outlined text-[140px] text-teal-900">shield</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceHub;
