
import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../App';
import { aiOversightService, AIStatus, AIAlert } from '../../services/ai-oversight';

const StatusBadge = ({ status }: { status: AIStatus }) => {
  const styles = {
    ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    WARNING: 'bg-rose-100 text-rose-700 border-rose-200',
    IDLE: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[8px] font-black border uppercase tracking-widest ${styles[status]}`}>
      {status}
    </span>
  );
};

const AIOversightPanel = () => {
  const { t } = useLanguage();
  const acc = t.aiCenter;
  
  const [selectedAI, setSelectedAI] = useState<string | null>(null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  
  const statuses = useMemo(() => aiOversightService.getAIAgentStatuses(), []);
  const alerts = useMemo(() => aiOversightService.getAlerts(), []);
  const relationships = useMemo(() => aiOversightService.getRelationships(), []);

  const agents = useMemo(() => {
    return Object.entries(acc.agents).map(([id, info]) => ({
      id,
      // Fix: Cast info to any to avoid "Spread types may only be created from object types" error
      ...(info as any),
      status: statuses[id] || 'ACTIVE'
    }));
  }, [acc.agents, statuses]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header & Emergency Control */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Protocol Oversight</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">MASTER_SENTRY_00 // AI_ORCHESTRATOR</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">AI Oversight Panel</h1>
          <p className="text-slate-500 font-medium italic">Giám sát toàn diện 18 bộ não điện tử vận hành hệ thống.</p>
        </div>
        
        <button 
          onClick={() => {
            if(window.confirm("CẢNH BÁO: Chế độ khẩn cấp sẽ tạm dừng các tiến trình AI nhạy cảm. Bạn có chắc chắn?")) {
              setEmergencyMode(!emergencyMode);
            }
          }}
          className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center gap-3 ${
            emergencyMode ? 'bg-rose-600 text-white animate-pulse' : 'bg-white border border-rose-200 text-rose-600 hover:bg-rose-50'
          }`}
        >
          <span className="material-symbols-outlined">{emergencyMode ? 'emergency_home' : 'emergency'}</span>
          {emergencyMode ? 'SYSTEM EMERGENCY ACTIVE' : 'Kích hoạt Chế độ Khẩn cấp'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* AI Network Map Grid */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm relative overflow-hidden">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-10 flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">hub</span>
                 Bản đồ Mạng lưới Agent (Inter-AI Connect)
              </h3>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 relative z-10">
                 {agents.map((agent) => (
                   <button 
                    key={agent.id}
                    onClick={() => setSelectedAI(agent.id)}
                    className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all group ${
                      selectedAI === agent.id ? 'bg-slate-900 border-primary scale-110 shadow-xl' : 'bg-ivory-surface border-ivory-border hover:border-primary'
                    }`}
                   >
                      <div className={`size-2 rounded-full ${
                        agent.status === 'ACTIVE' ? 'bg-emerald-500' : agent.status === 'WARNING' ? 'bg-rose-500 animate-ping' : 'bg-blue-500'
                      }`} />
                      <span className={`text-[10px] font-black ${selectedAI === agent.id ? 'text-white' : 'text-slate-400'}`}>{agent.id}</span>
                      <span className="material-symbols-outlined text-xl opacity-20 group-hover:opacity-100 transition-opacity">psychology</span>
                   </button>
                 ))}
              </div>

              {/* Decorative lines could be added here in SVG for real relationship visualization */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                 <svg className="w-full h-full">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                       <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                 </svg>
              </div>
           </div>

           {/* Selected AI Detail & Logs */}
           {selectedAI ? (
             <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-start mb-8">
                   <div className="flex items-center gap-6">
                      <div className="size-16 rounded-[24px] bg-primary flex items-center justify-center">
                         <span className="material-symbols-outlined text-3xl">terminal</span>
                      </div>
                      <div>
                         <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black tracking-tight uppercase">{selectedAI}: {acc.agents[selectedAI as keyof typeof acc.agents].name}</h2>
                            <StatusBadge status={statuses[selectedAI] || 'ACTIVE'} />
                         </div>
                         <p className="text-xs text-white/50 font-bold uppercase tracking-widest">{acc.agents[selectedAI as keyof typeof acc.agents].task}</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedAI(null)} className="text-white/20 hover:text-white transition-colors">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">Xử lý Log gần đây (Read-only)</p>
                      <div className="space-y-3 font-mono text-[10px] opacity-80">
                         {aiOversightService.getActivityLogs(selectedAI).map((log, i) => (
                           <div key={i} className="flex gap-4 border-b border-white/5 pb-2">
                              <span className="text-white/20">[{log.time}]</span>
                              <span className="flex-1">{log.action}</span>
                              <span className={log.result === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'}>{log.result}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                      <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4">Inter-AI Connections</p>
                      <div className="space-y-4">
                         {relationships.filter(r => r.from === selectedAI || r.to === selectedAI).map((rel, i) => (
                           <div key={i} className="flex items-center gap-4 text-xs font-bold">
                              <span className="text-primary">{rel.from}</span>
                              <span className="material-symbols-outlined text-white/20 text-sm">trending_flat</span>
                              <span className="text-emerald-400">{rel.to}</span>
                              <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded opacity-50 ml-auto">{rel.type}</span>
                           </div>
                         ))}
                         {relationships.filter(r => r.from === selectedAI || r.to === selectedAI).length === 0 && (
                           <p className="text-xs text-white/30 italic">Không có kết nối trực tiếp trong cụm này.</p>
                         )}
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="bg-ivory-surface border border-ivory-border border-dashed rounded-[48px] py-20 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">ads_click</span>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Chọn một AI từ bản đồ để xem chi tiết</p>
             </div>
           )}
        </div>

        {/* Alert Timeline Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Alert Timeline (Real-time)</h3>
              <div className="space-y-6">
                 {alerts.map(alert => (
                   <div key={alert.id} className="relative pl-6 border-l-2 border-slate-100 group">
                      <div className={`absolute -left-[5px] top-0 size-2 rounded-full ${
                        alert.severity === 'HIGH' ? 'bg-rose-500 animate-pulse' : alert.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <div className="mb-1 flex justify-between items-center">
                         <span className="text-[9px] font-black text-slate-900 uppercase">{alert.sourceId}</span>
                         <span className="text-[9px] font-mono text-slate-400">{alert.timestamp}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-snug group-hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedAI(alert.sourceId)}>
                         {alert.message}
                      </p>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-3 bg-slate-50 border border-ivory-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                 View Full Alert Log
              </button>
           </div>

           <div className="bg-slate-900 rounded-[48px] p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-6">AI Strategy Proposal</h4>
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                    <p className="text-[9px] font-black text-primary uppercase mb-2">From AI-18 (Evolution)</p>
                    <p className="text-xs italic text-white/70 leading-relaxed">
                      "Dựa trên 12 chu kỳ hoạt động, đề xuất tăng tỷ lệ phân bổ cho RISK_RESERVE thêm 0.5% để đối phó với biến động vàng."
                    </p>
                 </div>
                 <div className="flex gap-3">
                    <button className="flex-1 py-2 bg-primary text-white rounded-lg text-[9px] font-black uppercase">Approve for Vote</button>
                    <button className="flex-1 py-2 bg-white/10 text-white rounded-lg text-[9px] font-black uppercase">Dismiss</button>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 size-32 bg-primary/10 rounded-full blur-3xl"></div>
           </div>

           <div className="bg-amber-50 border border-amber-100 rounded-[40px] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-4">Oversight Rule #01</h3>
              <p className="text-[11px] text-amber-800 font-medium leading-relaxed italic">
                "Nhà quản trị không có quyền can thiệp vào logic thuật toán của Agent. Mọi điều chỉnh phải thông qua quy trình Đề xuất (Proposal) và đạt được đồng thuận từ cộng đồng nút."
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AIOversightPanel;
