
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { securityService, SecuritySignal, AlertSeverity } from '../services/security';

const SeverityBadge: React.FC<{ severity: AlertSeverity }> = ({ severity }) => {
  const styles = {
    CRITICAL: 'bg-rose-500/20 text-rose-500 border-rose-500/30',
    WARNING: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
    INFO: 'bg-blue-500/20 text-blue-500 border-blue-500/30'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-widest ${styles[severity]}`}>
      {severity}
    </span>
  );
};

const SecurityControlRoom = () => {
  const { t } = useLanguage();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await securityService.scanSecurityThreats([]);
      setReport(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      {/* SOC Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Final Defense Layer</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">AGENT: SECURITY_13 // RECON_CORE</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Trung tâm Kiểm soát Bảo mật</h1>
          <p className="text-slate-500 mt-2 font-medium italic">"Toán học không biết nói dối. Sổ cái không thể can thiệp."</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-ivory-border p-4 rounded-3xl flex items-center gap-4 shadow-sm">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Integrity</p>
                <p className={`text-xl font-black ${report?.overallScore > 90 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {report?.overallScore || '--'}%
                </p>
              </div>
              <span className={`material-symbols-outlined text-2xl ${report?.overallScore > 90 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {report?.overallScore > 90 ? 'shield_check' : 'shield_with_heart'}
              </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Reconciliation & Integrity */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Reconciliation Monitor */}
          <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                      <span className="material-symbols-outlined">account_balance</span>
                      Đối soát dòng tiền (Reconciliation)
                   </h3>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                     report?.reconciliationStatus === 'BALANCED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                   }`}>
                     {report?.reconciliationStatus || 'ANALYZING'}
                   </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                   <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                      <p className="text-[10px] font-black text-white/40 uppercase mb-2">Σ Value Created</p>
                      <p className="text-2xl font-black">1,482,000 <span className="text-xs text-white/30">V</span></p>
                   </div>
                   <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                      <p className="text-[10px] font-black text-white/40 uppercase mb-2">Σ Distributed</p>
                      <p className="text-2xl font-black">1,481,950 <span className="text-xs text-white/30">V</span></p>
                   </div>
                   <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-3xl">
                      <p className="text-[10px] font-black text-rose-400 uppercase mb-2">Discrepancy (Δ)</p>
                      <p className="text-2xl font-black text-rose-500">-50 <span className="text-xs opacity-50">V</span></p>
                   </div>
                </div>

                <div className="p-6 bg-black/40 border border-white/5 rounded-3xl font-mono text-[11px] text-emerald-400/70 leading-relaxed">
                   <p className="flex gap-4"><span className="text-white/20">[22:45:01]</span> <span>CHECK_DIST: User_0x...5a payout matches state rule. <span className="text-emerald-500">OK</span></span></p>
                   <p className="flex gap-4"><span className="text-white/20">[22:45:08]</span> <span className="text-rose-400 font-bold">RECON_FAIL: Block #148201 internal sum mismatch. Flagged for dispute.</span></p>
                   <p className="flex gap-4"><span className="text-white/20">[22:45:12]</span> <span>IDENTITY_VERIFY: Device_ID_7782 matches biometric hash. <span className="text-emerald-500">OK</span></span></p>
                </div>
             </div>
             <div className="absolute -bottom-24 -right-24 size-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          </div>

          {/* Active Security Signals */}
          <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
             <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
               <span className="material-symbols-outlined text-rose-600">radar</span>
               Tín hiệu rủi ro & Cảnh báo (Real-time)
             </h3>
             <div className="space-y-4">
                {report?.signals.map((signal: SecuritySignal) => (
                  <div key={signal.id} className="flex items-center justify-between p-6 bg-slate-50 border border-ivory-border rounded-3xl hover:bg-white hover:shadow-md transition-all group">
                    <div className="flex items-center gap-6">
                       <div className={`size-14 rounded-2xl flex items-center justify-center ${
                         signal.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                       }`}>
                         <span className="material-symbols-outlined text-2xl">
                           {signal.type === 'FRAUD' ? 'fingerprint_off' : 'data_thresholding'}
                         </span>
                       </div>
                       <div>
                         <div className="flex items-center gap-3 mb-1">
                           <SeverityBadge severity={signal.severity} />
                           <span className="text-[10px] font-mono text-slate-400 uppercase">{signal.id}</span>
                         </div>
                         <p className="font-black text-slate-800 tracking-tight leading-none mb-1">{signal.description}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{signal.type} DETECTED</p>
                       </div>
                    </div>
                    <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                       Phản hồi Dispute
                    </button>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Auth & Policy Control */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Multi-Factor Status */}
           <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Trạng thái Xác thực Danh tính</h3>
              <div className="space-y-6">
                 {[
                   { label: 'Device Fingerprint', status: 'ACTIVE', icon: 'phonelink_setup' },
                   { label: 'Biometric Hash', status: 'VERIFIED', icon: 'fingerprint' },
                   { label: 'Private Key (TEE)', status: 'LOCKED', icon: 'key' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                           <span className="material-symbols-outlined text-xl">{item.icon}</span>
                         </div>
                         <span className="text-xs font-bold text-slate-700">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase">{item.status}</span>
                   </div>
                 ))}
              </div>
              <div className="mt-8 pt-8 border-t border-ivory-border">
                 <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed">
                   "Không tìm thấy truy cập quản trị (Root/Admin) trái phép. Mọi quyền thực thi đều dựa trên vai trò OPERATOR hiện tại."
                 </p>
              </div>
           </div>

           {/* Security Principles for AI-13 */}
           <div className="bg-rose-600 rounded-[48px] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest mb-6">Nguyên tắc Bảo mật AI-13</h4>
                 <ul className="space-y-4">
                    {[
                      { icon: 'block', text: 'Không che giấu sai lệch' },
                      { icon: 'history', text: 'Không sửa lịch sử ledger' },
                      { icon: 'notifications_active', text: 'Cảnh báo rủi ro 24/7' },
                      { icon: 'policy', text: 'State-based Authorization' }
                    ].map((principle, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-medium text-white/80">
                         <span className="material-symbols-outlined text-white/50 text-sm">{principle.icon}</span>
                         {principle.text}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <span className="material-symbols-outlined text-[120px]">policy</span>
              </div>
           </div>

           {/* Policy Audit Status */}
           <div className="bg-ivory-surface border border-ivory-border rounded-[40px] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Kiểm tra Quy tắc Bất biến</h3>
              <div className="space-y-3">
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Anti-Wash Trading</span>
                    <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Zero-Override Enforcement</span>
                    <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Hash Chain Continuity</span>
                    <span className="material-symbols-outlined text-rose-500 text-sm">error</span>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default SecurityControlRoom;
