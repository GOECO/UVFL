
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { financeService, PayoutStructure, RoleLevel } from '../services/finance';

const RoleFinancialCenter = () => {
  const { t } = useLanguage();
  const [matrix, setMatrix] = useState<PayoutStructure>(financeService.getDistributionMatrix(true, true, true));
  const [simAmount, setSimAmount] = useState(1000);
  
  const [userState, setUserState] = useState({
    role: 'F2_OPERATOR' as RoleLevel,
    directKPI: 1450,
    networkKPI: 6200,
    validationScore: 97.5
  });

  const [aiInsight, setAiInsight] = useState<any>(null);

  useEffect(() => {
    const fetchInsight = async () => {
      const insight = await financeService.analyzePromotion(userState as any);
      setAiInsight(insight);
    };
    fetchInsight();
  }, [userState]);

  const calculateShare = (percent: number) => (simAmount * percent / 100).toLocaleString();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Financial Engine</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">AGENT: FINANCE_14 // PAYOUT_CORE</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Vai trò & Cấu trúc Tài chính</h1>
          <p className="text-slate-500 mt-2 font-medium italic">"Phân bổ dựa trên trần, thăng tiến dựa trên dữ liệu."</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Distribution Matrix & Simulator */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-600">account_tree</span>
                  Ma trận Phân bổ (Ceiling: 30%)
                </h3>
                <div className="flex gap-2">
                   {['F1+F2+F3', 'F1+F2', 'F1 Only'].map(mode => (
                     <button 
                       key={mode}
                       onClick={() => {
                          if (mode === 'F1+F2+F3') setMatrix(financeService.getDistributionMatrix(true, true, true));
                          if (mode === 'F1+F2') setMatrix(financeService.getDistributionMatrix(true, true, false));
                          if (mode === 'F1 Only') setMatrix(financeService.getDistributionMatrix(true, false, false));
                       }}
                       className="px-4 py-1.5 bg-slate-50 border border-ivory-border rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-amber-50 hover:text-amber-600 transition-all"
                     >
                       {mode}
                     </button>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                  { label: 'F1 Creator', percent: matrix.f1, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'F2 Operator', percent: matrix.f2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'F3 Guide', percent: matrix.f3, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'System Fund', percent: matrix.system, color: 'text-rose-600', bg: 'bg-rose-50' }
                ].map((item, i) => (
                  <div key={i} className={`${item.bg} p-6 rounded-3xl border border-ivory-border/50 text-center`}>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                     <p className={`text-3xl font-black ${item.color}`}>{item.percent}%</p>
                  </div>
                ))}
             </div>

             <div className="bg-slate-50 border border-ivory-border rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                   <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Trình mô phỏng thù lao (Simulator)</p>
                   <div className="relative">
                      <input 
                        type="number" 
                        value={simAmount} 
                        onChange={(e) => setSimAmount(Number(e.target.value))}
                        className="bg-white border border-ivory-border rounded-xl px-4 py-2 text-sm font-black w-32 focus:ring-2 ring-amber-500/20 outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">V</span>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-600">Thù lao F1</span>
                      <span className="font-black text-slate-900">{calculateShare(matrix.f1)} V</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-600">Thù lao F2</span>
                      <span className="font-black text-slate-900">{calculateShare(matrix.f2)} V</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-600">Thù lao F3</span>
                      <span className="font-black text-slate-900">{calculateShare(matrix.f3)} V</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-slate-900 text-white rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
             <h3 className="text-sm font-black uppercase tracking-widest text-amber-400 mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined">security_update_good</span>
                Nguyên tắc Chống Đa cấp Biến tướng
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-4">
                   <div className="flex gap-4">
                      <span className="material-symbols-outlined text-amber-500">do_not_disturb_on</span>
                      <div>
                         <p className="text-xs font-black uppercase tracking-tight">Không trả tiền giới thiệu</p>
                         <p className="text-[11px] text-white/50 font-medium leading-relaxed">Không có thù lao nếu không có giao dịch giá trị thực.</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <span className="material-symbols-outlined text-amber-500">history</span>
                      <div>
                         <p className="text-xs font-black uppercase tracking-tight">Điều kiện hạ cấp nghiêm ngặt</p>
                         <p className="text-[11px] text-white/50 font-medium leading-relaxed">Role không vĩnh viễn, tự động rớt nếu không đạt KPI.</p>
                      </div>
                   </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
                   <p className="text-[10px] text-amber-400 font-black uppercase mb-2">Audit Insight AI-14</p>
                   <p className="text-xs italic text-white/70 leading-relaxed">
                     "Mọi dòng tiền đều được gán nhãn với Hash ID của bản ghi giá trị gốc. Tổng thù lao không bao giờ vượt trần 30%, đảm bảo tính thanh khoản hệ thống."
                   </p>
                </div>
             </div>
             <div className="absolute -bottom-24 -right-24 size-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          </div>
        </div>

        {/* Right: Promotion Roadmap */}
        <div className="lg:col-span-4 space-y-8">
           
           <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Lộ trình thăng tiến</h3>
              <div className="text-center mb-8">
                 <div className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-600 text-[10px] font-black mb-2 uppercase">Current: {userState.role}</div>
                 <h4 className="text-2xl font-black text-slate-900 tracking-tight">Projected: {aiInsight?.decision || '---'}</h4>
              </div>

              <div className="space-y-6">
                 {aiInsight?.roadmap?.map((step: string, i: number) => (
                   <div key={i} className="flex gap-4 items-start">
                      <div className="size-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</div>
                      <p className="text-xs font-bold text-slate-700 leading-snug">{step}</p>
                   </div>
                 )) || <p className="text-center text-xs text-slate-400">Đang phân tích lộ trình...</p>}
              </div>

              <div className="mt-8 pt-8 border-t border-ivory-border space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Validation Quality</span>
                    <span className="text-sm font-black text-emerald-600">{userState.validationScore}%</span>
                 </div>
                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${userState.validationScore}%` }}></div>
                 </div>
              </div>
           </div>

           <div className="bg-amber-600 text-white rounded-[40px] p-8 shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest mb-6">Trạng thái Payout</h4>
                 <div className="space-y-6">
                    <div>
                       <p className="text-[10px] font-black text-white/50 uppercase mb-1">Dự kiến chu kỳ này</p>
                       <p className="text-3xl font-black">4,280 <span className="text-xs opacity-50">V</span></p>
                    </div>
                    <button className="w-full py-3 bg-white text-amber-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                       Xác nhận Payout Batch
                    </button>
                 </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <span className="material-symbols-outlined text-[100px]">account_balance_wallet</span>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default RoleFinancialCenter;
