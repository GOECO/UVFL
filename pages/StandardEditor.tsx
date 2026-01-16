
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { standardService, ChangeEntry, StandardSection } from '../services/standard';

const StandardEditor = () => {
  const { t } = useLanguage();
  const [sections, setSections] = useState<StandardSection[]>([]);
  const [changeLog, setChangeLog] = useState<ChangeEntry[]>([]);
  const [govSummary, setGovSummary] = useState('');
  const [activeTab, setActiveTab] = useState<'DOCUMENT' | 'LOG' | 'SUMMARY'>('DOCUMENT');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSections(standardService.getStandardSections());
    setChangeLog(standardService.getChangeLog());
    const loadSummary = async () => {
      const summary = await standardService.generateGovSummary('v4.3.0');
      setGovSummary(summary);
      setIsLoading(false);
    };
    loadSummary();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Protocol Authority</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">STANDARDS_EDITOR // UVFL_CORE</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">UVFL Global Standard</h1>
          <p className="text-slate-500 mt-2 font-medium italic">"Mã nguồn là Hiến pháp. Tiêu chuẩn là sự thực thi."</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-ivory-border p-4 rounded-3xl flex items-center gap-4 shadow-sm">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Standard</p>
                <p className="text-xl font-black text-slate-900">v4.3.0</p>
              </div>
              <span className="material-symbols-outlined text-2xl text-slate-500">menu_book</span>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ivory-border gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {[
          { id: 'DOCUMENT', label: 'Tài liệu Tiêu chuẩn', icon: 'description' },
          { id: 'LOG', label: 'Nhật ký thay đổi (Change Log)', icon: 'history' },
          { id: 'SUMMARY', label: 'Tóm tắt cho Đối tác', icon: 'assignment_turned_in' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 border-b-2 pb-3 font-bold text-sm tracking-wide transition-all ${
              activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main View Area */}
        <div className="lg:col-span-8">
           {activeTab === 'DOCUMENT' && (
             <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm space-y-12 animate-in slide-in-from-bottom-4">
                {sections.map(section => (
                  <div key={section.id} className="space-y-4">
                    <h3 className="text-xl font-black text-slate-900 flex items-baseline gap-4">
                      <span className="text-primary font-mono opacity-30">#{section.id.toString().padStart(2, '0')}</span>
                      {section.title}
                    </h3>
                    <div className="p-8 bg-ivory-surface/50 border border-ivory-border rounded-3xl text-sm text-slate-600 leading-relaxed font-medium">
                      {section.content}
                    </div>
                  </div>
                ))}
             </div>
           )}

           {activeTab === 'LOG' && (
             <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm animate-in slide-in-from-bottom-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-ivory-border">
                      <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Version</th>
                      <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Changes</th>
                      <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-border">
                    {changeLog.map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-all group">
                        <td className="py-6">
                           <p className="font-black text-slate-900">{log.version}</p>
                           <p className="text-[10px] text-slate-400 font-bold">{log.date}</p>
                        </td>
                        <td className="py-6 max-w-md">
                           <p className="text-sm font-bold text-slate-700 mb-1">{log.change}</p>
                           <p className="text-[11px] text-slate-400 font-medium italic">Why: {log.reason}</p>
                        </td>
                        <td className="py-6 text-right">
                           <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">
                             {log.impact}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           )}

           {activeTab === 'SUMMARY' && (
             <div className="bg-slate-900 text-white rounded-[48px] p-12 shadow-2xl relative overflow-hidden animate-in zoom-in-95">
                <div className="relative z-10 space-y-8">
                   <div className="flex justify-between items-center border-b border-white/10 pb-8">
                      <h3 className="text-xl font-black uppercase tracking-tight text-teal-400">Executive Summary (Gov Partner)</h3>
                      <button className="material-symbols-outlined text-white/50 hover:text-white transition-all">download</button>
                   </div>
                   <div className="prose prose-invert max-w-none text-white/80 font-medium leading-relaxed italic whitespace-pre-wrap">
                      {isLoading ? "Đang biên soạn tóm tắt bằng trí tuệ nhân tạo..." : govSummary}
                   </div>
                </div>
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <span className="material-symbols-outlined text-[160px]">verified</span>
                </div>
             </div>
           )}
        </div>

        {/* Sidebar: Compliance & Annex */}
        <div className="lg:col-span-4 space-y-8">
           
           <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Annex C: Test Scenarios</h3>
              <div className="space-y-4">
                 {[
                   { label: 'P2P Offline Validation', status: 'PASSED' },
                   { label: 'ERP Cross-border Payout', status: 'PASSED' },
                   { label: 'Rule Recalculation v4.3', status: 'SIMULATED' },
                   { label: 'ZKP Privacy Bridge', status: 'PASSED' }
                 ].map((test, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-ivory-border">
                      <span className="text-[11px] font-bold text-slate-700">{test.label}</span>
                      <span className={`text-[9px] font-black ${test.status === 'PASSED' ? 'text-emerald-500' : 'text-amber-500'}`}>{test.status}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-primary rounded-[48px] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest mb-6">Migration Notes</h4>
                 <p className="text-xs text-white/80 font-medium leading-relaxed">
                    Nút v1.0–v4.1 cần thực hiện nâng cấp firmware để hỗ trợ "Mesh Anchoring" trước chu kỳ Recalculation tiếp theo.
                 </p>
                 <button className="mt-8 w-full py-4 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                    Hướng dẫn Nâng cấp
                 </button>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <span className="material-symbols-outlined text-[120px]">upgrade</span>
              </div>
           </div>

           <div className="bg-ivory-surface border border-ivory-border rounded-[40px] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Conformance Checklist</h3>
              <div className="space-y-3">
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">ISO-20022 Ready</span>
                    <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Recursive Tuning</span>
                    <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Offline Mesh V2</span>
                    <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default StandardEditor;
