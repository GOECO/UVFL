
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../App';
import { simulationService, SimulationScenario, SimulationResult } from '../../services/simulation';

const SimulationBadge = () => (
  <div className="bg-amber-100 text-amber-700 border border-amber-200 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm animate-pulse">
    <span className="material-symbols-outlined text-sm">science</span>
    SIMULATION – NOT REAL DATA
  </div>
);

const RoleSimulationCenter = () => {
  const { t } = useLanguage();
  const rulesets = simulationService.getAvailableRuleSets();
  
  const [selectedRuleset, setSelectedRuleset] = useState(rulesets[0]);
  const [scenario, setScenario] = useState<SimulationScenario>({
    f1Count: 1200,
    f2Count: 450,
    f3Count: 80,
    avgRevenue: 1500,
    validationRate: 94,
    rulesetVersion: rulesets[0].id
  });

  const results = useMemo(() => 
    simulationService.calculate(scenario, selectedRuleset.matrix),
  [scenario, selectedRuleset]);

  const currentMainnet = rulesets[0];
  const mainnetResults = useMemo(() => 
    simulationService.calculate(scenario, currentMainnet.matrix),
  [scenario]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <SimulationBadge />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Mô phỏng Vai trò & Dự báo</h1>
          <p className="text-slate-500 mt-2 font-medium italic">Thử nghiệm các biến số kinh tế trước khi triển khai chính thức.</p>
        </div>
        
        <div className="bg-white border border-ivory-border p-2 rounded-2xl flex gap-1 shadow-sm">
           {rulesets.map(rs => (
             <button 
               key={rs.id}
               onClick={() => setSelectedRuleset(rs)}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 selectedRuleset.id === rs.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-50'
               }`}
             >
               {rs.label}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Scenario Input Panel */}
        <div className="lg:col-span-4 bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm space-y-8">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined">settings_input_component</span>
              Kịch bản đầu vào
           </h3>
           
           <div className="space-y-6">
              {[
                { key: 'f1Count', label: 'Số lượng F1', icon: 'person' },
                { key: 'f2Count', label: 'Số lượng F2', icon: 'badge' },
                { key: 'f3Count', label: 'Số lượng F3', icon: 'military_tech' },
                { key: 'avgRevenue', label: 'Doanh thu TB (V)', icon: 'payments' },
                { key: 'validationRate', label: 'Tỷ lệ Xác thực (%)', icon: 'verified' }
              ].map(field => (
                <div key={field.key} className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                      {field.label}
                      <span className="text-primary font-mono">{scenario[field.key as keyof SimulationScenario]}</span>
                   </label>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 text-sm">{field.icon}</span>
                      <input 
                        type="range" 
                        min={field.key === 'validationRate' ? 0 : 0}
                        max={field.key === 'avgRevenue' ? 10000 : 5000}
                        value={scenario[field.key as keyof SimulationScenario]}
                        onChange={(e) => setScenario({...scenario, [field.key]: Number(e.target.value)})}
                        className="w-full accent-primary h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                      />
                   </div>
                </div>
              ))}
           </div>

           <div className="pt-8 border-t border-ivory-border">
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                Xuất báo cáo PDF (Simulation)
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
              </button>
           </div>
        </div>

        {/* Comparison & Output Panel */}
        <div className="lg:col-span-8 space-y-8">
           
           {/* Primary KPI Results */}
           <div className={`rounded-[48px] p-10 shadow-2xl relative overflow-hidden transition-all duration-700 ${
              results.isViolation ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'
           }`}>
              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
                 <div className="space-y-6">
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Tỷ lệ Phân bổ Thực tế</p>
                    <div className="flex items-baseline gap-4">
                       <h2 className="text-7xl font-black tracking-tighter">{results.effectiveRate.toFixed(2)}%</h2>
                       <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                         results.isViolation ? 'bg-white text-rose-600' : 'bg-emerald-500 text-white'
                       }`}>
                         {results.isViolation ? 'VƯỢT TRẦN' : 'HỢP LỆ'}
                       </div>
                    </div>
                    {results.isViolation && (
                      <p className="text-sm font-bold flex items-center gap-2 animate-bounce">
                        <span className="material-symbols-outlined">warning</span>
                        CẢNH BÁO: Phân bổ vượt quá 30%. RuleSet này không thể triển khai!
                      </p>
                    )}
                 </div>

                 <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                       <p className="text-[9px] font-black text-white/40 uppercase mb-2">Tổng giá trị mô phỏng</p>
                       <p className="text-xl font-black">{results.totalRevenue.toLocaleString()} <span className="text-xs opacity-30">V</span></p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                       <p className="text-[9px] font-black text-white/40 uppercase mb-2">Tổng thù lao chi trả</p>
                       <p className="text-xl font-black">{results.distributedAmount.toLocaleString()} <span className="text-xs opacity-30">V</span></p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                       <p className="text-[9px] font-black text-white/40 uppercase mb-2">Dự báo Demotion (F2-F1)</p>
                       <p className="text-xl font-black text-amber-400">{results.demotionForecast} <span className="text-xs opacity-30">Nodes</span></p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                       <p className="text-[9px] font-black text-white/40 uppercase mb-2">Chi phí Royalty (Truyền thừa)</p>
                       <p className="text-xl font-black text-teal-400">+{results.royaltyPayout.toLocaleString()} <span className="text-xs opacity-30">V</span></p>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-24 -right-24 size-96 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
           </div>

           {/* Before vs After Comparison Table */}
           <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">compare_arrows</span>
                So sánh: Hiện tại vs Mô phỏng
              </h3>
              
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-ivory-border">
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tham số Ma trận</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mainnet (v4.4.0)</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mô phỏng ({selectedRuleset.id})</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Chênh lệch</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-ivory-border">
                       {[
                         { label: 'F1 - Creator Share', key: 'f1', unit: '%' },
                         { label: 'F2 - Operator Share', key: 'f2', unit: '%' },
                         { label: 'F3 - Guide Share', key: 'f3', unit: '%' },
                         { label: 'System Fund Rate', key: 'fund', unit: '%' }
                       ].map(row => (
                         <tr key={row.key} className="group hover:bg-slate-50 transition-all">
                            <td className="py-5">
                               <p className="text-sm font-black text-slate-800">{row.label}</p>
                            </td>
                            <td className="py-5 font-bold text-slate-500">
                               {currentMainnet.matrix[row.key as keyof typeof currentMainnet.matrix]}{row.unit}
                            </td>
                            <td className="py-5 font-black text-primary">
                               {selectedRuleset.matrix[row.key as keyof typeof selectedRuleset.matrix]}{row.unit}
                            </td>
                            <td className="py-5 text-right">
                               <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                                 selectedRuleset.matrix[row.key as keyof typeof selectedRuleset.matrix] > currentMainnet.matrix[row.key as keyof typeof currentMainnet.matrix] 
                                 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                               }`}>
                                 {selectedRuleset.matrix[row.key as keyof typeof selectedRuleset.matrix] > currentMainnet.matrix[row.key as keyof typeof currentMainnet.matrix] ? '+' : ''}
                                 {(selectedRuleset.matrix[row.key as keyof typeof selectedRuleset.matrix] - currentMainnet.matrix[row.key as keyof typeof currentMainnet.matrix]).toFixed(1)}
                                 {row.unit}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Insights Card */}
           <div className="bg-ivory-surface border border-ivory-border rounded-[40px] p-8 flex items-start gap-6">
              <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                 <span className="material-symbols-outlined text-2xl">psychology</span>
              </div>
              <div>
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">Phân tích Hệ thống (AI-14 Foresight)</h4>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed">
                   Dựa trên kịch bản hiện tại, việc tăng thù lao F1 ({selectedRuleset.matrix.f1}%) sẽ thúc đẩy mật độ tạo giá trị nhanh hơn 12%. Tuy nhiên, {results.isViolation ? 'ngân sách hệ thống sẽ bị thâm hụt nghiêm trọng.' : 'hệ thống vẫn duy trì được biên độ an toàn 2.5%.'} Khuyến nghị: {results.isViolation ? 'Giảm F2 Share xuống 8.0% để cân bằng.' : 'Tiếp tục theo dõi biến số demotion wave.'}
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default RoleSimulationCenter;
