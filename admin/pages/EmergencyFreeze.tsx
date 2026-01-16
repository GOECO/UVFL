
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../App';
import { emergencyService, EmergencyState, FreezeEvent } from '../../services/emergency';

const EmergencyFreeze = () => {
  const { t } = useLanguage();
  const [state, setState] = useState<EmergencyState>(emergencyService.getEmergencyState());
  const [history, setHistory] = useState<FreezeEvent[]>(emergencyService.getFreezeHistory());
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleFreeze = async () => {
    if (!reason) {
      alert("Vui lòng nhập lý do thực thi.");
      return;
    }
    
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate protocol propagation

    if (state.isFrozen) {
      emergencyService.deactivateFreeze(reason, 'ADMIN_CORE');
    } else {
      emergencyService.activateFreeze(reason, 'ADMIN_CORE');
    }

    setState(emergencyService.getEmergencyState());
    setHistory(emergencyService.getFreezeHistory());
    setReason('');
    setIsProcessing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Alert Banner */}
      {state.isFrozen && (
        <div className="bg-rose-600 p-8 rounded-[48px] text-white shadow-2xl shadow-rose-600/30 animate-pulse flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-rose-400">
           <div className="flex items-center gap-6 text-center md:text-left">
              <span className="material-symbols-outlined text-6xl">emergency_home</span>
              <div>
                 <h2 className="text-3xl font-black uppercase tracking-tighter italic">Protocol Frozen</h2>
                 <p className="font-bold opacity-80 uppercase tracking-widest text-sm">Giao dịch CREATE & DISTRIBUTE đã bị đình chỉ.</p>
              </div>
           </div>
           <div className="bg-white/10 px-6 py-4 rounded-3xl border border-white/20 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase mb-1">ID Sự cố: {state.activeFreezeId}</p>
              <p className="text-xs font-bold italic">"{state.reason}"</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Control Console */}
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                   <span className="material-symbols-outlined text-rose-600">settings_remote</span>
                   Emergency Protocol Console
                 </h3>
                 <div className="flex items-center gap-2">
                    <span className={`size-3 rounded-full ${state.isFrozen ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-ping' : 'bg-emerald-500'}`}></span>
                    <span className="text-[10px] font-black uppercase">{state.isFrozen ? 'Emergency Active' : 'System Stable'}</span>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="p-8 bg-slate-50 border border-ivory-border rounded-[40px] text-center">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Trạng thái Thực thi Hiện tại</p>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-6 bg-white border border-ivory-border rounded-3xl shadow-inner flex flex-col items-center">
                          <span className={`material-symbols-outlined text-4xl mb-2 ${state.isFrozen ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {state.isFrozen ? 'block' : 'check_circle'}
                          </span>
                          <p className="text-[10px] font-black uppercase text-slate-400">CREATE Mode</p>
                          <p className="text-sm font-black text-slate-900">{state.isFrozen ? 'DISABLED' : 'ACTIVE'}</p>
                       </div>
                       <div className="p-6 bg-white border border-ivory-border rounded-3xl shadow-inner flex flex-col items-center">
                          <span className={`material-symbols-outlined text-4xl mb-2 ${state.isFrozen ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {state.isFrozen ? 'block' : 'check_circle'}
                          </span>
                          <p className="text-[10px] font-black uppercase text-slate-400">DISTRIBUTE Mode</p>
                          <p className="text-sm font-black text-slate-900">{state.isFrozen ? 'DISABLED' : 'ACTIVE'}</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {state.isFrozen ? 'Lý do Mở khóa (Thaw Reason)' : 'Lý do Đóng băng (Freeze Justification)'}
                    </label>
                    <textarea 
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Giải trình chi tiết hành động khẩn cấp..."
                      className="w-full bg-slate-50 border border-ivory-border rounded-[32px] p-6 text-sm font-bold text-slate-800 focus:ring-4 ring-rose-500/10 outline-none h-32"
                    />
                 </div>

                 <button 
                  onClick={handleToggleFreeze}
                  disabled={isProcessing}
                  className={`w-full py-6 rounded-[32px] font-black text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                    state.isFrozen ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 'bg-rose-600 text-white shadow-rose-600/20'
                  }`}
                 >
                    {isProcessing ? 'Communicating with Nodes...' : (state.isFrozen ? 'Initiate Protocol Thaw (Mở khóa)' : 'Trigger Emergency Freeze (Đóng băng)')}
                    <span className="material-symbols-outlined">
                       {isProcessing ? 'sync' : (state.isFrozen ? 'lock_open' : 'emergency')}
                    </span>
                 </button>
              </div>
           </div>
        </div>

        {/* History Timeline */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-xl h-[700px] flex flex-col">
              <h3 className="text-sm font-black uppercase tracking-widest text-rose-400 mb-10">Freeze/Thaw History Log</h3>
              <div className="flex-1 space-y-8 overflow-y-auto scrollbar-hide pr-2">
                 {history.map((event, i) => (
                   <div key={i} className="relative pl-10 border-l border-white/10 pb-8 last:pb-0">
                      <div className={`absolute -left-[5px] top-0 size-2.5 rounded-full ${
                        event.type === 'FREEZE' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                      }`} />
                      <div className="mb-2 flex justify-between items-center">
                         <span className="text-[10px] font-black text-white/40 uppercase">{event.timestamp}</span>
                         <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                           event.type === 'FREEZE' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                         }`}>
                           {event.type}
                         </span>
                      </div>
                      <p className="text-xs font-bold text-white/80 leading-relaxed mb-3">{event.reason}</p>
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[10px] text-white/30">person</span>
                            <span className="text-[9px] font-mono text-white/50 uppercase">{event.actor}</span>
                         </div>
                         <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[10px] text-white/30">fingerprint</span>
                            <span className="text-[9px] font-mono text-white/50 truncate max-w-[80px]">{event.evidenceHash}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="mt-8 pt-8 border-t border-white/5">
                 <p className="text-[10px] text-white/30 italic">"Lịch sử này là vĩnh viễn và không thể xóa bỏ để phục vụ công tác kiểm soát rủi ro."</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default EmergencyFreeze;
