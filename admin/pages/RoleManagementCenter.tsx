
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../App';
import { roleManagementService, UVFLRole, UVFLPermission } from '../../services/role-management';

const RoleManagementCenter = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'MATRIX' | 'ROLES' | 'AUDIT' | 'SCHEMA'>('MATRIX');
  
  const roles = useMemo(() => roleManagementService.getCoreRoles(), []);
  const permissions = useMemo(() => roleManagementService.getPermissions(), []);
  const auditLogs = useMemo(() => roleManagementService.getAuditLogs(), []);
  const schema = useMemo(() => roleManagementService.getSchema(), []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Access Protocol</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">UVFL_SRBAC_v1.0 // NO_SUPER_ADMIN</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase">Role & Permission Center</h1>
          <p className="text-slate-500 font-medium italic">Quản trị bảo mật đa tầng, tách biệt quyền hạn ứng dụng và kinh tế.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-ivory-border rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4">
              <div className="size-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                 <span className="material-symbols-outlined">shield_person</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Defined Roles</p>
                 <p className="text-xl font-black text-slate-900">{roles.length}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-ivory-border gap-8 overflow-x-auto scrollbar-hide">
        {[
          { id: 'MATRIX', label: 'Permission Matrix', icon: 'grid_view' },
          { id: 'ROLES', label: 'Application Roles', icon: 'manage_accounts' },
          { id: 'AUDIT', label: 'Role Audit Trail', icon: 'history_edu' },
          { id: 'SCHEMA', label: 'Data Schema', icon: 'schema' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 border-b-2 pb-4 font-bold text-xs uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Tab 1: Matrix View */}
        {activeTab === 'MATRIX' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
               <div className="px-10 py-8 border-b border-ivory-border flex justify-between items-center bg-ivory-surface/20">
                  <h3 className="text-sm font-black uppercase tracking-widest">Ma trận Phân quyền SRBAC</h3>
                  <div className="flex gap-4">
                     <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase"><span className="size-2 bg-emerald-500 rounded-full"></span> Allowed</span>
                     <span className="flex items-center gap-1 text-[10px] font-black text-slate-300 uppercase"><span className="size-2 bg-slate-200 rounded-full"></span> Denied</span>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-ivory-surface/50 border-b border-ivory-border">
                           <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[200px]">Application Role</th>
                           {permissions.map(p => (
                             <th key={p.id} className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-tighter text-center">
                                {p.action}:{p.resource}
                                <br/><span className="opacity-50">[{p.scope}]</span>
                             </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-ivory-border">
                        {roles.map(role => (
                          <tr key={role.id} className="hover:bg-slate-50 transition-colors group">
                             <td className="px-10 py-6">
                                <div className="flex flex-col">
                                   <span className="text-sm font-black text-slate-900 tracking-tight uppercase leading-none mb-1">{role.name}</span>
                                   <span className="text-[10px] font-bold text-slate-400 uppercase">{role.target} Role</span>
                                </div>
                             </td>
                             {permissions.map(p => (
                               <td key={p.id} className="px-6 py-6 text-center">
                                  {role.permissions.includes(p.id) ? (
                                    <div className="size-6 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                                       <span className="material-symbols-outlined text-sm font-black">check</span>
                                    </div>
                                  ) : (
                                    <div className="size-1.5 bg-slate-100 rounded-full mx-auto" />
                                  )}
                               </td>
                             ))}
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
            
            <div className="p-8 bg-slate-900 text-white rounded-[40px] flex items-start gap-6 shadow-xl relative overflow-hidden">
               <div className="size-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20 z-10">
                  <span className="material-symbols-outlined text-3xl">policy</span>
               </div>
               <div className="z-10">
                  <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-2">Immutable Security Logic</h4>
                  <p className="text-xs text-white/60 font-medium leading-relaxed italic max-w-3xl">
                    "Hệ thống SRBAC không cho phép bất kỳ vai trò nào có quyền 'Super User' (Toàn quyền). Mọi thay đổi logic kinh tế phải được thực thi thông qua Ruleset Engine và được đồng thuận bởi mạng lưới nút. Quyền ứng dụng chỉ phục vụ mục đích CRUD dữ liệu định danh và trạng thái hạ tầng."
                  </p>
               </div>
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined text-[140px]">security</span>
               </div>
            </div>
          </div>
        )}

        {/* Tab 2: Role Details & Assignments */}
        {activeTab === 'ROLES' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
             <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {roles.map(role => (
                     <div key={role.id} className="bg-white border border-ivory-border rounded-[32px] p-8 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                           <div className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
                              {role.target}
                           </div>
                           {role.isCore && <span className="material-symbols-outlined text-slate-300 text-sm">lock</span>}
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-primary transition-colors uppercase">{role.name}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 h-10 overflow-hidden">{role.description}</p>
                        
                        <div className="space-y-4">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Constraints & Limits</p>
                           <div className="flex flex-wrap gap-2">
                              {role.constraints?.map(c => (
                                <span key={c} className="px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[9px] font-bold uppercase">
                                   {c.replace(/_/g, ' ')}
                                </span>
                              ))}
                              {(!role.constraints || role.constraints.length === 0) && <span className="text-[9px] text-slate-300 italic font-medium">No constraints defined.</span>}
                           </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-ivory-border flex justify-between items-center">
                           <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                              Assign Members <span className="material-symbols-outlined text-sm">person_add</span>
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             
             <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm sticky top-24">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Access Assignment</h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Entity (User/App ID)</label>
                         <input className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none focus:ring-4 ring-primary/5" placeholder="e.g. USER-778102" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign Application Role</label>
                         <select className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none appearance-none">
                            {roles.map(r => <option key={r.id}>{r.name}</option>)}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Effective Scope</label>
                         <div className="grid grid-cols-2 gap-2">
                            <button className="py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase">Global</button>
                            <button className="py-3 bg-slate-50 border border-ivory-border text-slate-600 rounded-xl text-[10px] font-black uppercase">Country Specific</button>
                         </div>
                      </div>
                      <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all">
                         Authorize Assignment
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Tab 3: Audit Trail */}
        {activeTab === 'AUDIT' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
             <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
                <div className="px-10 py-8 border-b border-ivory-border bg-ivory-surface/20 flex justify-between items-center">
                   <h3 className="text-sm font-black uppercase tracking-widest">Nhật ký thay đổi Quyền (Immutable Audit)</h3>
                   <button className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Verify Hash Chain
                   </button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-ivory-surface/50 border-b border-ivory-border">
                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp / Actor</th>
                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Profile</th>
                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ledger Reference</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-ivory-border">
                         {auditLogs.map((log, i) => (
                           <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="px-10 py-6">
                                 <p className="text-xs font-black text-slate-900 mb-1">{log.actor}</p>
                                 <p className="text-[9px] font-mono text-slate-400 font-bold uppercase">{log.timestamp}</p>
                              </td>
                              <td className="px-10 py-6">
                                 <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-indigo-100">{log.action}</span>
                              </td>
                              <td className="px-10 py-6">
                                 <p className="text-sm font-black text-slate-900 tracking-tight">{log.target}</p>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase">Role: {log.role}</p>
                              </td>
                              <td className="px-10 py-6 text-right font-mono text-[10px] text-primary font-bold">
                                 {log.hash.substring(0, 16)}...
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {/* Tab 4: Schema View */}
        {activeTab === 'SCHEMA' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
             <div className="lg:col-span-8">
                <div className="bg-slate-900 rounded-[48px] p-10 text-emerald-400 shadow-2xl relative overflow-hidden">
                   <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-white/40">SRBAC Data Schema Definition (SQL/JSON)</h3>
                      <button className="text-white/40 hover:text-white transition-colors">
                         <span className="material-symbols-outlined text-lg">content_copy</span>
                      </button>
                   </div>
                   <pre className="font-mono text-[11px] leading-relaxed max-h-[500px] overflow-y-auto scrollbar-hide">
{JSON.stringify(schema, null, 2)}
                   </pre>
                </div>
             </div>
             <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Security Constraints</h4>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                         <span className="font-bold text-slate-600">Recursive Verification</span>
                         <span className="text-emerald-500 font-black uppercase text-[10px]">ENABLED</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                         <span className="font-bold text-slate-600">Multi-sig Role Assignment</span>
                         <span className="text-rose-500 font-black uppercase text-[10px]">MANDATORY</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                         <span className="font-bold text-slate-600">Auto-revoke on Inactivity</span>
                         <span className="text-slate-400 font-black uppercase text-[10px]">30 DAYS</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RoleManagementCenter;
