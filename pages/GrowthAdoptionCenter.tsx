
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { growthService, GrowthPlaybook, GrowthMetrics } from '../services/growth';

const GrowthAdoptionCenter = () => {
  const { t } = useLanguage();
  const [playbook, setPlaybook] = useState<GrowthPlaybook | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mockMetrics: GrowthMetrics = {
    userCount: 8500,
    valuePerUser: 145.2,
    validationDensity: 0.12 // 1 validator per 8 users
  };

  useEffect(() => {
    const loadPlaybook = async () => {
      const result = await growthService.generatePlaybook('VN', mockMetrics);
      setPlaybook(result);
      setIsLoading(false);
    };
    loadPlaybook();
  }, []);

  const phases = ['PILOT', 'COMMUNITY', 'ENTERPRISE', 'PUBLIC'];
  const currentPhaseIndex = phases.indexOf(playbook?.phase || 'PILOT');

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Growth Engine</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">AGENT: ADOPTION_16 // NETWORK_DENSITY</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Tăng trưởng & Tiếp nhận</h1>
          <p className="text-slate-500 mt-2 font-medium italic">"Mở rộng bằng giá trị thực, không bằng lời hứa ảo."</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-ivory-border p-4 rounded-3xl flex items-center gap-4 shadow-sm">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adoption Readiness</p>
                <p className="text-xl font-black text-orange-600">{playbook?.readinessScore || '--'}%</p>
              </div>
              <span className="material-symbols-outlined text-2xl text-orange-500">trending_up</span>
           </div>
        </div>
      </div>

      {/* Adoption Stepper */}
      <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm overflow-hidden relative">
         <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[140px] text-slate-900">rocket_launch</span>
         </div>
         
         <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-12">Lộ trình tiếp nhận (Adoption Roadmap)</h3>
         
         <div className="flex justify-between items-start relative px-4">
            <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-100 z-0">
               <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${(currentPhaseIndex / (phases.length - 1)) * 100}%` }}></div>
            </div>
            
            {phases.map((p, i) => (
              <div key={p} className="relative z-10 flex flex-col items-center gap-4 group">
                 <div className={`size-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${
                   i <= currentPhaseIndex ? 'bg-orange-500 text-white border-orange-100 shadow-lg shadow-orange-500/20' : 'bg-white text-slate-300 border-slate-100'
                 }`}>
                    <span className="text-[10px] font-black">{i + 1}</span>
                 </div>
                 <div className="text-center">
                    <p className={`text-[10px] font-black tracking-widest uppercase ${i <= currentPhaseIndex ? 'text-slate-900' : 'text-slate-300'}`}>{p}</p>
                    {i === currentPhaseIndex && <span className="text-[8px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">ACTIVE</span>}
                 </div>
              </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Playbook & Metrics */}
        <div className="lg:col-span-8 space-y-8">
           
           <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <span className="material-symbols-outlined text-orange-400">auto_stories</span>
                    <h3 className="text-sm font-black uppercase tracking-widest text-orange-400">Growth Playbook: {playbook?.country}</h3>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Chiến lược đề xuất</p>
                       <div className="space-y-4">
                          {playbook?.strategies.map((s, i) => (
                            <div key={i} className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                               <span className="text-orange-500 font-black">0{i+1}</span>
                               <p className="text-xs font-bold text-white/80 leading-snug">{s}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                    
                    <div className="space-y-6">
                       <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Dấu hiệu bất thường (Anomalies)</p>
                       <div className="space-y-4">
                          {playbook?.anomalies.map((a, i) => (
                            <div key={i} className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="material-symbols-outlined text-rose-400 text-xs">report_problem</span>
                                  <span className="text-[9px] font-black text-rose-400 uppercase">Warning Signal</span>
                               </div>
                               <p className="text-[11px] font-medium text-rose-100/70">{a}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-24 -right-24 size-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Mật độ Xác thực (Validation Density)</h4>
                 <div className="flex items-end justify-between mb-4">
                    <p className="text-3xl font-black text-slate-900">{mockMetrics.validationDensity * 100}%</p>
                    <span className="text-[10px] font-bold text-emerald-500">STABLE</span>
                 </div>
                 <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${mockMetrics.validationDensity * 100}%` }}></div>
                 </div>
                 <p className="text-[10px] text-slate-400 mt-4 font-medium italic">"Mục tiêu: 25% mật độ để đảm bảo phân quyền tuyệt đối."</p>
              </div>

              <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Giá trị trung bình/Người dùng</h4>
                 <div className="flex items-end justify-between mb-4">
                    <p className="text-3xl font-black text-slate-900">${mockMetrics.valuePerUser}</p>
                    <span className="text-[10px] font-bold text-orange-500">GROWING</span>
                 </div>
                 <p className="text-[10px] text-slate-400 mt-4 font-medium italic">"Tăng trưởng bền vững dựa trên việc gia tăng giá trị tạo ra, không phải số lượng đầu người."</p>
              </div>
           </div>
        </div>

        {/* Right Column: AI Insights & Incentives */}
        <div className="lg:col-span-4 space-y-8">
           
           <div className="bg-orange-600 rounded-[48px] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest mb-6">Adopt readiness</h4>
                 <p className="text-xs text-white/70 font-medium leading-relaxed mb-8">
                    Vùng dữ liệu đang tiến gần đến giai đoạn <b>Enterprise</b>. Đề xuất kích hoạt các module HS Code nâng cao và tích hợp thuế quan tự động cho các doanh nghiệp xuất nhập khẩu.
                 </p>
                 <button className="w-full py-4 bg-white text-orange-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                    Tải về Báo cáo Tiếp nhận
                 </button>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <span className="material-symbols-outlined text-[100px]">hub</span>
              </div>
           </div>

           <div className="bg-ivory-surface border border-ivory-border rounded-[40px] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Incentive Mechanism</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">F3 Referral Reward</span>
                    <span className="text-rose-500 font-black">DISABLED</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Validation Bonus</span>
                    <span className="text-emerald-500 font-black">ACTIVE (+5%)</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Value Gen Multiplier</span>
                    <span className="text-emerald-500 font-black">ACTIVE (1.2x)</span>
                 </div>
              </div>
              <div className="mt-6 pt-6 border-t border-ivory-border">
                 <p className="text-[9px] text-slate-400 italic">
                    "Chúng tôi chỉ thưởng cho các hành vi đóng góp trực tiếp vào an ninh và giá trị mạng lưới."
                 </p>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default GrowthAdoptionCenter;
