
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../App';
import { dataRightsService, UserDataEntry, ExportLog } from '../../services/data-rights';

const DataRightsExportCenter = () => {
  const { t } = useLanguage();
  const [targetUserId, setTargetUserId] = useState('USER-7782');
  const [purpose, setPurpose] = useState('');
  const [format, setFormat] = useState<'JSON' | 'CSV'>('JSON');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);

  const userData = useMemo(() => dataRightsService.getUserData(targetUserId), [targetUserId]);
  const auditLogs = useMemo(() => dataRightsService.getAuditLogs(), []);

  const handleExport = async () => {
    if (!agreedToDisclaimer || !purpose) return;
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const logId = await dataRightsService.requestExport(targetUserId, format, purpose);
    setIsExporting(false);
    setShowExportModal(false);
    alert(`Dữ liệu đã được chuẩn bị. Mã kiểm toán: ${logId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Ownership Matrix</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">AGENT: SOVEREIGNTY_15 // RIGHTS_MANAGER</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase">Data Rights & Export Center</h1>
          <p className="text-slate-500 max-w-xl font-medium italic">Thực thi quyền kiểm soát dữ liệu cá nhân của người dùng.</p>
        </div>
        
        <div className="flex bg-white border border-ivory-border p-2 rounded-2xl shadow-sm">
           <input 
            type="text" 
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            className="px-4 py-2 text-xs font-bold text-slate-700 outline-none border-none bg-transparent"
            placeholder="Tìm kiếm User ID..."
           />
           <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Load Profile</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Data Ownership Matrix */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
              <div className="px-10 py-8 border-b border-ivory-border flex justify-between items-center">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
                   <span className="material-symbols-outlined text-indigo-600">database</span>
                   Ma trận Sở hữu Dữ liệu
                 </h3>
                 <button 
                  onClick={() => setShowExportModal(true)}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-2"
                 >
                   <span className="material-symbols-outlined text-sm">download_for_offline</span>
                   Request Data Export
                 </button>
              </div>
              
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-ivory-surface/50 border-b border-ivory-border">
                       <tr>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hạng mục</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mô tả</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vị trí lưu trữ</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quyền sở hữu</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Privacy</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-ivory-border">
                       {userData.map(entry => (
                         <tr key={entry.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-10 py-6">
                               <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                 entry.category === 'PRIVATE' ? 'bg-rose-100 text-rose-600' : 
                                 entry.category === 'DERIVED' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                               }`}>
                                 {entry.category}
                               </span>
                            </td>
                            <td className="px-10 py-6 text-sm font-bold text-slate-800">{entry.description}</td>
                            <td className="px-10 py-6 text-[10px] font-mono font-bold text-slate-400">{entry.storage}</td>
                            <td className="px-10 py-6">
                               <span className={`text-[10px] font-black uppercase tracking-tighter ${
                                 entry.owner === 'USER' ? 'text-indigo-600' : 'text-slate-400'
                               }`}>
                                 {entry.owner === 'USER' ? 'User-owned' : 'System-governed'}
                               </span>
                            </td>
                            <td className="px-10 py-6 text-right">
                               <span className="material-symbols-outlined text-sm text-slate-300">
                                 {entry.category === 'PRIVATE' ? 'lock' : 'visibility'}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Export Audit Log */}
           <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Export Activity Audit Log</h3>
              <div className="space-y-4">
                 {auditLogs.map(log => (
                   <div key={log.id} className="flex items-center justify-between p-6 bg-slate-50 border border-ivory-border rounded-3xl hover:shadow-md transition-all">
                      <div className="flex items-center gap-6">
                         <div className="size-12 rounded-2xl bg-white border border-ivory-border flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined">history</span>
                         </div>
                         <div>
                            <p className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1">
                               {log.actor} exported for {log.userId}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.purpose}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-mono font-bold text-slate-500">{log.timestamp}</p>
                         <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded font-black">{log.format}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Info & Policy Panel */}
        <div className="lg:col-span-4 space-y-6">
           
           <div className="bg-slate-900 rounded-[48px] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined">policy</span>
                    Compliance Framework
                 </h4>
                 <div className="space-y-6">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-3xl">
                       <p className="text-[10px] font-black text-white/40 uppercase mb-2">GDPR Article 20</p>
                       <p className="text-xs text-white/70 italic leading-relaxed">
                          "Quyền di chuyển dữ liệu (Right to Data Portability) cho phép người dùng nhận lại các dữ liệu cá nhân đã cung cấp cho hệ thống theo định dạng cấu trúc."
                       </p>
                    </div>
                    <ul className="space-y-4">
                       {[
                         { icon: 'verified', text: 'Tự động gỡ định danh PII' },
                         { icon: 'shield_with_heart', text: 'Mã hóa đầu cuối (TEE)' },
                         { icon: 'history', text: 'Nhật ký băm không thể xóa' }
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-xs font-medium text-white/80">
                            <span className="material-symbols-outlined text-indigo-400 text-sm">{item.icon}</span>
                            {item.text}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 size-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
           </div>

           <div className="bg-amber-50 border border-amber-100 rounded-[40px] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-6">Security Warning</h3>
              <p className="text-xs text-amber-800 font-medium leading-relaxed italic mb-6">
                "Việc xuất dữ liệu Private ra khỏi môi trường mã hóa của UVFL Global làm tăng rủi ro rò rỉ thông tin cá nhân. Người xuất dữ liệu chịu hoàn toàn trách nhiệm về việc lưu trữ các tệp này."
              </p>
              <div className="flex items-center gap-2">
                 <span className="size-2 bg-amber-500 rounded-full animate-pulse"></span>
                 <span className="text-[10px] font-black text-amber-700 uppercase">Audit Trail Active</span>
              </div>
           </div>

        </div>
      </div>

      {/* Export Modal Overlay */}
      {showExportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-ivory-border flex justify-between items-center bg-ivory-surface/30">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Yêu cầu Xuất dữ liệu</h2>
                    <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-widest">User: {targetUserId}</p>
                 </div>
                 <button onClick={() => setShowExportModal(false)} className="size-10 rounded-full hover:bg-white flex items-center justify-center text-slate-400 border border-transparent hover:border-ivory-border transition-all">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>

              <div className="p-10 space-y-8">
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setFormat('JSON')}
                      className={`py-4 rounded-3xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                        format === 'JSON' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-ivory-border'
                      }`}
                    >
                      JSON Format
                    </button>
                    <button 
                      onClick={() => setFormat('CSV')}
                      className={`py-4 rounded-3xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                        format === 'CSV' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-ivory-border'
                      }`}
                    >
                      CSV Table
                    </button>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mục đích sử dụng (Bắt buộc)</label>
                    <textarea 
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="Giải trình lý do trích xuất dữ liệu..."
                      className="w-full bg-slate-50 border border-ivory-border rounded-3xl p-6 text-sm font-bold text-slate-800 focus:ring-4 ring-indigo-500/10 outline-none h-32"
                    />
                 </div>

                 <div className="p-6 bg-rose-50 border border-rose-100 rounded-[32px]">
                    <div className="flex items-start gap-4">
                       <input 
                        type="checkbox" 
                        id="disclaimer" 
                        checked={agreedToDisclaimer}
                        onChange={(e) => setAgreedToDisclaimer(e.target.checked)}
                        className="mt-1 size-5 text-indigo-600 border-ivory-border rounded focus:ring-indigo-500"
                       />
                       <label htmlFor="disclaimer" className="text-[11px] text-rose-800 font-medium leading-relaxed italic">
                          "Tôi xác nhận rằng yêu cầu xuất dữ liệu này là chính đáng và tôi chịu trách nhiệm bảo mật thông tin sau khi dữ liệu rời khỏi hệ thống UVFL Global."
                       </label>
                    </div>
                 </div>
              </div>

              <div className="px-10 py-8 bg-ivory-surface/50 border-t border-ivory-border flex gap-4">
                 <button 
                    disabled={!agreedToDisclaimer || !purpose || isExporting}
                    onClick={handleExport}
                    className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-3xl shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                 >
                    {isExporting ? 'Processing Architecture...' : 'Generate Secure Archive'}
                    <span className={`material-symbols-outlined text-sm ${isExporting ? 'animate-spin' : ''}`}>
                      {isExporting ? 'sync' : 'verified_user'}
                    </span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DataRightsExportCenter;
