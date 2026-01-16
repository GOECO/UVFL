
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../App';
import { complianceDiffService, DiffItem } from '../../services/compliance-diff';
import { CountryProfileData } from '../../services/governor';

const RiskBadge = ({ level }: { level: string }) => {
  const styles: any = {
    HIGH: 'bg-rose-100 text-rose-600 border-rose-200',
    MEDIUM: 'bg-amber-100 text-amber-600 border-amber-200',
    LOW: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-widest ${styles[level]}`}>
      {level} RISK
    </span>
  );
};

const ComplianceDiffViewer = () => {
  const { t } = useLanguage();
  
  // Mock Versions Data
  const versions: Record<string, CountryProfileData> = {
    '4.2.0': {
      version: '4.2.0',
      country_name: 'Vietnam',
      iso_code: 'VN',
      default_asset: 'USDT',
      allowed_assets: ['USDT', 'GOLD', 'VND'],
      reward_enabled: false,
      tax: { vat: 10, gold_duty: 5 }
    },
    '4.3.0': {
      version: '4.3.0',
      country_name: 'Vietnam (Regulated)',
      iso_code: 'VN',
      default_asset: 'VND',
      allowed_assets: ['VND', 'GOLD', 'USDT', 'REWARD'],
      reward_enabled: true,
      tax: { vat: 8, gold_duty: 2 }
    }
  };

  const [v1Key, setV1Key] = useState('4.2.0');
  const [v2Key, setV2Key] = useState('4.3.0');
  const [showLog, setShowLog] = useState(false);

  const diffs = useMemo(() => 
    complianceDiffService.compare(versions[v1Key], versions[v2Key]), 
  [v1Key, v2Key]);

  const changelog = useMemo(() => 
    complianceDiffService.generateChangelog(diffs, versions[v1Key].country_name, v1Key, v2Key),
  [diffs]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">Compliance Diff Viewer</h1>
          <p className="text-slate-500 font-medium">So sánh và phân tích thay đổi chính sách giữa các phiên bản hồ sơ quốc gia.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-[32px] border border-ivory-border shadow-sm">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Base</span>
              <select 
                value={v1Key} 
                onChange={(e) => setV1Key(e.target.value)}
                className="bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none"
              >
                {Object.keys(versions).map(k => <option key={k} value={k}>v{k}</option>)}
              </select>
           </div>
           <span className="material-symbols-outlined text-slate-300">arrow_forward</span>
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Compare</span>
              <select 
                value={v2Key} 
                onChange={(e) => setV2Key(e.target.value)}
                className="bg-primary/10 text-primary border-none rounded-xl text-xs font-bold px-4 py-2 outline-none"
              >
                {Object.keys(versions).map(k => <option key={k} value={k}>v{k}</option>)}
              </select>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Diff Table */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-ivory-surface/50 border-b border-ivory-border">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tham số (Field)</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cũ (v{v1Key})</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mới (v{v2Key})</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Rủi ro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-border">
                   {diffs.length === 0 ? (
                     <tr>
                        <td colSpan={4} className="px-8 py-20 text-center opacity-30">
                           <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                           <p className="text-xs font-bold uppercase tracking-widest">Không có thay đổi giữa hai phiên bản</p>
                        </td>
                     </tr>
                   ) : (
                     diffs.map((d, i) => (
                       <tr key={i} className="group hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-6">
                             <p className="text-sm font-black text-slate-900 tracking-tight mb-1 uppercase">{d.field}</p>
                             <p className="text-[9px] font-mono text-slate-400">{d.path}</p>
                          </td>
                          <td className="px-8 py-6">
                             <div className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-mono line-through opacity-60">
                                {JSON.stringify(d.oldValue)}
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${
                                d.risk === 'HIGH' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                             }`}>
                                {JSON.stringify(d.newValue)}
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <RiskBadge level={d.risk} />
                          </td>
                       </tr>
                     ))
                   )}
                </tbody>
              </table>
           </div>
        </div>

        {/* Impact & Changelog Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           
           <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/40 mb-8 flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">analytics</span>
                 Impact Summary
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                    <p className="text-[9px] font-black text-white/40 uppercase mb-2 tracking-widest">High Risk</p>
                    <p className="text-3xl font-black text-rose-500">{diffs.filter(d => d.risk === 'HIGH').length}</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                    <p className="text-[9px] font-black text-white/40 uppercase mb-2 tracking-widest">Medium Risk</p>
                    <p className="text-3xl font-black text-amber-500">{diffs.filter(d => d.risk === 'MEDIUM').length}</p>
                 </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                 <button 
                  onClick={() => setShowLog(!showLog)}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                 >
                   {showLog ? 'Hide Changelog' : 'Generate Changelog'}
                   <span className="material-symbols-outlined text-sm">history_edu</span>
                 </button>
              </div>
              <div className="absolute -bottom-10 -right-10 size-40 bg-primary/10 rounded-full blur-3xl"></div>
           </div>

           {showLog && (
             <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Public Changelog Snippet</h4>
                   <button 
                    onClick={() => navigator.clipboard.writeText(changelog)}
                    className="text-primary hover:scale-110 transition-transform"
                   >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                   </button>
                </div>
                <div className="bg-slate-50 border border-ivory-border rounded-2xl p-6 font-mono text-[10px] leading-relaxed text-slate-700 whitespace-pre-wrap">
                   {changelog}
                </div>
                <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors">
                   Publish to Network
                </button>
             </div>
           )}

           <div className="bg-amber-50 border border-amber-100 rounded-[32px] p-6 flex gap-4">
              <span className="material-symbols-outlined text-amber-500 shrink-0">info</span>
              <p className="text-[11px] text-amber-800 font-medium leading-relaxed italic">
                 "Việc thay đổi thuế suất (Tax) được đánh dấu HIGH RISK vì nó ảnh hưởng trực tiếp đến logic tính toán của Rule Engine tại thời điểm runtime."
              </p>
           </div>

        </div>

      </div>
    </div>
  );
};

export default ComplianceDiffViewer;
