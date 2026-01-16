
import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../App';
import { disputeService, Dispute, DisputeStatus } from '../../services/dispute-resolution';

const SeverityIndicator = ({ severity }: { severity: string }) => {
  const styles: any = {
    CRITICAL: 'bg-rose-600 text-white',
    HIGH: 'bg-orange-500 text-white',
    MEDIUM: 'bg-amber-400 text-slate-900',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${styles[severity]}`}>
      {severity}
    </span>
  );
};

const DisputeResolutionCenter = () => {
  const { t } = useLanguage();
  const [disputes, setDisputes] = useState<Dispute[]>(disputeService.getDisputes());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [aiRec, setAiRec] = useState<string>('');

  const activeDispute = useMemo(() => disputes.find(d => d.id === selectedId), [selectedId, disputes]);

  useEffect(() => {
    if (activeDispute && activeDispute.status !== 'RESOLVED') {
      setAiRec('Analyzing digital evidence...');
      disputeService.getAIRecommendation(activeDispute).then(setAiRec);
    }
  }, [selectedId]);

  const handleResolve = (action: 'CONFIRM' | 'VOID' | 'ADJUST') => {
    if (!selectedId || !resolutionText) return;
    
    setDisputes(prev => prev.map(d => 
      d.id === selectedId ? { ...d, status: action === 'VOID' ? 'VOIDED' : 'RESOLVED' } : d
    ));
    setResolutionText('');
    setSelectedId(null);
    alert(`Giao dịch ${selectedId} đã được phân xử: ${action}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Justice Layer</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">AGENT: SECURITY_13 // RESOLUTION_CORE</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase">Disputes & Resolution</h1>
          <p className="text-slate-500 font-medium italic">Phân xử các sai lệch hạch toán và bảo vệ tính minh bạch của Sổ cái.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Dispute Queue */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm h-[700px] flex flex-col">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                 <span className="material-symbols-outlined text-rose-500">gavel</span>
                 Active Dispute Queue ({disputes.filter(d => d.status !== 'RESOLVED' && d.status !== 'VOIDED').length})
              </h3>
              
              <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 pr-2">
                 {disputes.map(d => (
                   <button 
                    key={d.id}
                    onClick={() => setSelectedId(d.id)}
                    className={`w-full text-left p-6 rounded-[32px] border transition-all relative overflow-hidden group ${
                      selectedId === d.id ? 'bg-slate-900 border-primary shadow-xl scale-[1.02]' : 'bg-slate-50 border-ivory-border hover:border-primary'
                    }`}
                   >
                      <div className="flex justify-between items-start mb-4 relative z-10">
                         <div>
                            <p className={`text-[9px] font-black uppercase mb-1 ${selectedId === d.id ? 'text-primary' : 'text-slate-400'}`}>{d.type}</p>
                            <h4 className={`text-sm font-black tracking-tight ${selectedId === d.id ? 'text-white' : 'text-slate-900'}`}>{d.id}</h4>
                         </div>
                         <SeverityIndicator severity={d.severity} />
                      </div>
                      
                      <div className="flex justify-between items-end relative z-10">
                         <div className="space-y-1">
                            <p className={`text-[10px] font-bold ${selectedId === d.id ? 'text-white/40' : 'text-slate-400'}`}>Target: {d.recordId}</p>
                            <p className={`text-xs font-black ${selectedId === d.id ? 'text-white' : 'text-slate-700'}`}>{d.amount.toLocaleString()} {d.asset}</p>
                         </div>
                         <span className={`text-[9px] font-black uppercase ${
                           d.status === 'OPEN' ? 'text-rose-500' : d.status === 'IN_REVIEW' ? 'text-amber-500' : 'text-emerald-500'
                         }`}>
                           {d.status}
                         </span>
                      </div>

                      {selectedId === d.id && (
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                           <span className="material-symbols-outlined text-6xl text-white">balance</span>
                        </div>
                      )}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Resolution Workspace */}
        <div className="lg:col-span-7">
           {activeDispute ? (
             <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm space-y-10 animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-start border-b border-ivory-border pb-8">
                   <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Phân xử: {activeDispute.id}</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Cắm cờ bởi: {activeDispute.flaggedBy} • {activeDispute.createdAt}</p>
                   </div>
                   <button onClick={() => setSelectedId(null)} className="text-slate-300 hover:text-slate-900 transition-colors">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Chi tiết Sự cố</label>
                         <div className="bg-slate-50 border border-ivory-border rounded-3xl p-6 italic text-sm text-slate-600 leading-relaxed">
                            "{activeDispute.description}"
                         </div>
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Bằng chứng kỹ thuật (Evidence Hashes)</label>
                         <div className="space-y-2">
                            {activeDispute.evidenceHashes.map(h => (
                              <div key={h} className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl">
                                 <span className="material-symbols-outlined text-emerald-400 text-sm">fingerprint</span>
                                 <code className="text-[9px] font-mono text-white/60 truncate">{h}</code>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-8">
                         <div className="flex items-center gap-2 mb-4">
                            <div className="size-8 bg-primary text-white rounded-lg flex items-center justify-center">
                               <span className="material-symbols-outlined text-sm">psychology</span>
                            </div>
                            <span className="text-[10px] font-black text-primary uppercase">Khuyến nghị của AI-13</span>
                         </div>
                         <p className="text-sm text-slate-800 font-black leading-relaxed italic">
                            "{aiRec}"
                         </p>
                      </div>
                      
                      <div className="bg-rose-50 border border-rose-100 rounded-[32px] p-6">
                         <p className="text-[10px] font-black text-rose-600 uppercase mb-2">Dự kiến Slashing</p>
                         <p className="text-xs text-rose-800 font-medium leading-relaxed">
                            Bản ghi này đã được xác thực bởi 3 Nút. Nếu chọn <b>VOID</b>, các nút này sẽ bị trừ <b>-15 VRS</b> mỗi nút do lỗi tắc trách.
                         </p>
                      </div>
                   </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-ivory-border">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quyết định Phân xử (Resolution Log)</label>
                   <textarea 
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                    placeholder="Nhập lý do phân xử và cơ sở pháp lý/kỹ thuật..."
                    className="w-full bg-slate-50 border border-ivory-border rounded-[32px] p-6 text-sm font-bold text-slate-800 focus:ring-4 ring-primary/10 outline-none h-32"
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <button 
                    disabled={!resolutionText}
                    onClick={() => handleResolve('CONFIRM')}
                    className="py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                   >
                      Confirm Record
                   </button>
                   <button 
                    disabled={!resolutionText}
                    onClick={() => handleResolve('ADJUST')}
                    className="py-4 bg-amber-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                   >
                      Issue Adjustment
                   </button>
                   <button 
                    disabled={!resolutionText}
                    onClick={() => handleResolve('VOID')}
                    className="py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50"
                   >
                      Permanent Void
                   </button>
                </div>
             </div>
           ) : (
             <div className="bg-ivory-surface border border-ivory-border border-dashed rounded-[48px] h-[700px] flex flex-col items-center justify-center text-center p-12">
                <div className="size-24 bg-white border border-ivory-border rounded-[40px] flex items-center justify-center text-slate-300 mb-6 shadow-sm">
                   <span className="material-symbols-outlined text-5xl">balance</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">Resolution Workspace</h3>
                <p className="text-sm text-slate-400 max-w-sm font-medium">Chọn một tranh chấp từ danh sách bên trái để bắt đầu quy trình xem xét bằng chứng và phân xử.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default DisputeResolutionCenter;
