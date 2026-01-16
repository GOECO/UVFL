
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../App';
import { apiKeyService, APIKey, KeyCategory } from '../../services/api-key-manager';

const CategoryIcon = ({ cat }: { cat: KeyCategory }) => {
  const icons: any = {
    AI_PROVIDER: 'psychology',
    PAYMENT: 'payments',
    EXTERNAL_INFRA: 'cloud_sync',
    INTERNAL: 'terminal',
  };
  return <span className="material-symbols-outlined">{icons[cat] || 'key'}</span>;
};

const APIKeyManager = () => {
  const { t } = useLanguage();
  const [keys, setKeys] = useState<APIKey[]>(apiKeyService.getKeys());
  const logs = useMemo(() => apiKeyService.getAuditLogs(), []);

  const stats = useMemo(() => {
    return {
      active: keys.filter(k => k.status === 'ACTIVE').length,
      alerts: keys.filter(k => (k.currentUsage / k.dailyBudget) > 0.8 && k.status === 'ACTIVE').length,
      totalMonthlyCost: keys.reduce((sum, k) => sum + k.currentUsage, 0)
    };
  }, [keys]);

  const handleRotate = async (id: string) => {
    if(window.confirm("Xác nhận xoay vòng (Rotate) Key này? Key cũ sẽ bị vô hiệu hóa sau 24h.")) {
      await apiKeyService.rotateKey(id);
      alert("Quy trình Rotation đã được kích hoạt.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header & Global Status */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Security Layer</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">PROTOCOL: VAULT_ACCESS_v1</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase">API Key Management</h1>
          <p className="text-slate-500 font-medium italic">Quản lý tập trung thông tin định danh dịch vụ và bảo mật hạ tầng.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-ivory-border rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4">
              <div className="size-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                 <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Active Keys</p>
                 <p className="text-xl font-black text-slate-900">{stats.active}</p>
              </div>
           </div>
           <div className="bg-white border border-ivory-border rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4">
              <div className="size-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                 <span className="material-symbols-outlined">report</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Quota Alerts</p>
                 <p className="text-xl font-black text-rose-600">{stats.alerts}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Vault List */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
              <div className="px-10 py-8 border-b border-ivory-border flex justify-between items-center bg-ivory-surface/20">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
                   <span className="material-symbols-outlined text-primary">encrypted</span>
                   API Key Vault (Masked)
                 </h3>
                 <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:scale-105 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Register New Service
                 </button>
              </div>
              
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-ivory-surface/50 border-b border-ivory-border">
                       <tr>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service / ID</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Value</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usage/Budget</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-ivory-border">
                       {keys.map(key => {
                         const usagePercent = (key.currentUsage / key.dailyBudget) * 100;
                         return (
                           <tr key={key.id} className="group hover:bg-slate-50 transition-colors">
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className={`size-10 rounded-xl flex items-center justify-center ${
                                      key.status === 'ACTIVE' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                       <CategoryIcon cat={key.category} />
                                    </div>
                                    <div>
                                       <p className="text-sm font-black text-slate-900 tracking-tight uppercase leading-none mb-1">{key.name}</p>
                                       <p className="text-[9px] font-mono text-slate-400 font-bold uppercase">{key.id}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-10 py-6">
                                 <code className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{key.maskedValue}</code>
                              </td>
                              <td className="px-10 py-6">
                                 <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                                   key.environment === 'PROD' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                                 }`}>
                                    {key.environment}
                                 </span>
                              </td>
                              <td className="px-10 py-6">
                                 <div className="w-32 space-y-2">
                                    <div className="flex justify-between text-[8px] font-black uppercase">
                                       <span className="text-slate-400">Usage</span>
                                       <span className={usagePercent > 80 ? 'text-rose-600' : 'text-slate-900'}>
                                          {key.currentUsage} / {key.dailyBudget}
                                       </span>
                                    </div>
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                       <div 
                                        className={`h-full transition-all duration-1000 ${usagePercent > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                        style={{ width: `${Math.min(usagePercent, 100)}%` }} 
                                       />
                                    </div>
                                 </div>
                              </td>
                              <td className="px-10 py-6 text-right">
                                 <div className="flex justify-end gap-2">
                                    <button 
                                      onClick={() => handleRotate(key.id)}
                                      className="p-2 hover:bg-white hover:shadow-md border border-transparent hover:border-ivory-border rounded-lg text-slate-400 hover:text-primary transition-all"
                                      title="Rotate Key"
                                    >
                                       <span className="material-symbols-outlined text-sm">published_with_changes</span>
                                    </button>
                                    <button className="p-2 hover:bg-white hover:shadow-md border border-transparent hover:border-ivory-border rounded-lg text-slate-400 hover:text-rose-600 transition-all" title="Revoke">
                                       <span className="material-symbols-outlined text-sm">block</span>
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         );
                       })}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Access Audit Log */}
           <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Service Access Audit Log</h3>
              <div className="space-y-4">
                 {logs.map((log, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-slate-50 border border-ivory-border rounded-3xl group">
                      <div className="flex items-center gap-6">
                         <div className="size-12 rounded-2xl bg-white border border-ivory-border flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined">policy</span>
                         </div>
                         <div>
                            <p className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1">
                               {log.service} <span className="text-slate-300 font-medium">via</span> {log.keyId}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.timestamp}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="flex items-center gap-2 mb-1">
                            <span className={`size-1.5 rounded-full ${log.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            <span className={`text-[10px] font-black uppercase ${log.status === 'SUCCESS' ? 'text-emerald-600' : 'text-rose-600'}`}>{log.status}</span>
                         </div>
                         <p className="text-[9px] font-mono text-slate-400">{log.latency}ms</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar: Security Policy & Insights */}
        <div className="lg:col-span-4 space-y-8">
           
           <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined">security_update_good</span>
                    Vault Security Policy
                 </h4>
                 <div className="space-y-6">
                    {[
                      { title: 'At-Rest Encryption', desc: 'Mọi API Key đều được mã hóa AES-256 trước khi lưu vào DB.' },
                      { title: 'ZeroClear Enforcement', desc: 'Clear-text key không bao giờ được phép xuất hiện trong log hoặc UI.' },
                      { title: 'Auto-Rotation', desc: 'Hệ thống tự động nhắc nhở xoay Key mỗi 90 ngày cho dịch vụ External.' }
                    ].map((p, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                         <p className="text-xs font-black text-primary uppercase mb-2">{p.title}</p>
                         <p className="text-[11px] text-white/50 leading-relaxed font-medium italic">"{p.desc}"</p>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 size-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
           </div>

           <div className="bg-ivory-surface border border-ivory-border rounded-[40px] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Credential Health</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Avg. Rotation Age</span>
                    <span className="text-slate-900 font-black uppercase text-[10px]">42 Days</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Expired Keys</span>
                    <span className="text-rose-500 font-black uppercase text-[10px]">1 Detected</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Access Denials (24h)</span>
                    <span className="text-slate-900 font-black uppercase text-[10px]">0 Events</span>
                 </div>
              </div>
           </div>

           <div className="bg-emerald-600 rounded-[48px] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                 <span className="material-symbols-outlined text-4xl mb-6">shield_lock</span>
                 <h4 className="text-lg font-black tracking-tight mb-2 uppercase leading-none text-white">Non-Exportable Credentials</h4>
                 <p className="text-xs text-white/70 font-medium leading-relaxed italic">
                    "Tài liệu hạch toán hạ tầng đảm bảo không cá nhân nào (kể cả Root Admin) có thể trích xuất API Key hàng loạt ra khỏi hệ thống. Mọi tương tác Key đơn lẻ đều được log bằng mã vân tay người thực thi."
                 </p>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <span className="material-symbols-outlined text-[100px]">lock_person</span>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default APIKeyManager;
