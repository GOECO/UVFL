
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { sovereigntyService, DataAsset, PrivacyReport } from '../services/sovereignty';

const DataSovereigntyCenter = () => {
  const { t } = useLanguage();
  const [report, setReport] = useState<PrivacyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mockAssets: DataAsset[] = [
    { id: 'DAT-001', type: 'EVIDENCE', ownerId: 'USER-07', encryptionStatus: 'ENCRYPTED_TEE', residency: 'VN', createdAt: '2024-03-24' },
    { id: 'DAT-042', type: 'RECORD', ownerId: 'USER-07', encryptionStatus: 'PUBLIC_HASH', residency: 'VN', createdAt: '2024-03-23' },
    { id: 'DAT-108', type: 'IDENTITY', ownerId: 'USER-07', encryptionStatus: 'ENCRYPTED_TEE', residency: 'VN', createdAt: '2024-01-15' }
  ];

  useEffect(() => {
    const fetchCompliance = async () => {
      const result = await sovereigntyService.verifyCompliance('VN', mockAssets);
      setReport(result);
      setIsLoading(false);
    };
    fetchCompliance();
  }, []);

  const handleExport = () => {
    const data = sovereigntyService.exportUserData('USER-07', mockAssets);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UVFL_Sovereignty_Export_USER07.json`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Ownership Enforcement</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">AGENT: SOVEREIGNTY_15 // DATA_OWNER</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Chủ quyền & Sở hữu Dữ liệu</h1>
          <p className="text-slate-500 mt-2 font-medium italic">"Dữ liệu của bạn là tài sản của bạn. Chúng tôi chỉ là người gác cổng."</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-ivory-border p-4 rounded-3xl flex items-center gap-4 shadow-sm">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sovereignty Score</p>
                <p className="text-xl font-black text-indigo-600">{report?.sovereigntyScore || '--'}%</p>
              </div>
              <span className="material-symbols-outlined text-2xl text-indigo-500">verified_user</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: My Data Assets */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  <span className="material-symbols-outlined text-indigo-600">inventory_2</span>
                  Danh sách Tài sản Dữ liệu của tôi
                </h3>
                <button 
                  onClick={handleExport}
                  className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Xuất dữ liệu (JSON)
                </button>
             </div>

             <div className="space-y-4">
                {mockAssets.map(asset => (
                  <div key={asset.id} className="flex items-center justify-between p-6 bg-slate-50 border border-ivory-border rounded-3xl hover:bg-white hover:shadow-md transition-all group">
                    <div className="flex items-center gap-6">
                       <div className="size-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                         <span className="material-symbols-outlined text-2xl">
                           {asset.type === 'EVIDENCE' ? 'photo_camera' : asset.type === 'IDENTITY' ? 'fingerprint' : 'description'}
                         </span>
                       </div>
                       <div>
                         <p className="font-black text-slate-800 tracking-tight leading-none mb-1 uppercase">{asset.type}: {asset.id}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Stored in: {asset.residency} • {asset.createdAt}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                         {asset.encryptionStatus}
                       </span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden">
             <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined">visibility_off</span>
                Vùng chứa Ẩn danh (Anonymization Layer)
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                   <p className="text-[10px] font-black text-white/40 uppercase mb-4 tracking-widest">Dữ liệu chia sẻ với AI-09 (Analytics)</p>
                   <p className="text-xs text-white/70 italic leading-relaxed">
                     "Mọi giao dịch của bạn được gom nhóm và gỡ bỏ định danh (PII). AI chỉ nhìn thấy xu hướng, không nhìn thấy danh tính."
                   </p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                   <p className="text-[10px] font-black text-white/40 uppercase mb-4 tracking-widest">Quyền được quên (Right to Erasure)</p>
                   <p className="text-xs text-white/70 italic leading-relaxed">
                     "Yêu cầu xóa dữ liệu bằng chứng sẽ được thực thi ngay lập tức tại Nút sở tại. Hash giao dịch trên Ledger sẽ được đánh dấu 'Tài sản đã hủy'."
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Residency & Compliance */}
        <div className="lg:col-span-4 space-y-8">
           
           <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Lưu trữ Dữ liệu tại chỗ (Residency)</h3>
              <div className="text-center mb-8">
                 <div className="size-20 bg-indigo-100 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-4 border border-indigo-200">
                    <span className="material-symbols-outlined text-4xl">location_on</span>
                 </div>
                 <h4 className="text-xl font-black text-slate-900 tracking-tight">Node Region: Vietnam (VN)</h4>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Status: COMPLIANT</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-ivory-border">
                 <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600">Cross-border flow</span>
                    <span className="text-rose-500 font-black uppercase tracking-tighter">RESTRICTED</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600">Local TEE Encryption</span>
                    <span className="text-emerald-500 font-black uppercase tracking-tighter">ACTIVE</span>
                 </div>
              </div>
           </div>

           <div className="bg-indigo-600 rounded-[48px] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest mb-6">Cam kết của AI-15</h4>
                 <ul className="space-y-4">
                    {[
                      { icon: 'do_not_disturb_on', text: 'Không bao giờ bán dữ liệu' },
                      { icon: 'lock', text: 'Mã hóa mặc định' },
                      { icon: 'ads_click', text: 'Không thao túng hành vi' },
                      { icon: 'history', text: 'Nhật ký truy cập dữ liệu (Audit)' }
                    ].map((principle, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-medium text-white/80">
                         <span className="material-symbols-outlined text-white/50 text-sm">{principle.icon}</span>
                         {principle.text}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <span className="material-symbols-outlined text-[100px]">lock_person</span>
              </div>
           </div>

           <div className="bg-ivory-surface border border-ivory-border rounded-[40px] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Data Lifecycle</h3>
              <div className="space-y-3">
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Evidence Retention</span>
                    <span className="text-slate-900 font-black">2 Years</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Anonymized Ledger</span>
                    <span className="text-slate-900 font-black">Permanent</span>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default DataSovereigntyCenter;
