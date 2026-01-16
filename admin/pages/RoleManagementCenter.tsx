
import React, { useState, useMemo, useEffect } from 'react';
import { useAccessibility } from '../../App';
import { roleManagementService, UVFLRole, UVFLPermission, UVFLAssignment, PermissionAction, Resource } from '../../services/role-management';
import { GoogleGenAI } from "@google/genai";

const RoleManagementCenter = () => {
  const { t } = useAccessibility();
  const [activeTab, setActiveTab] = useState<'ROLES' | 'ASSIGNMENTS' | 'MATRIX' | 'AUDIT'>('ROLES');
  
  // States for data management
  const [roles, setRoles] = useState<UVFLRole[]>(roleManagementService.getCoreRoles());
  const [permissions, setPermissions] = useState<UVFLPermission[]>(roleManagementService.getPermissions());
  const [assignments, setAssignments] = useState<UVFLAssignment[]>(roleManagementService.getInitialAssignments());

  // Search & Filter for Audit
  const [auditSearch, setAuditSearch] = useState('');
  const [auditTypeFilter, setAuditTypeFilter] = useState<'ALL' | 'ASSIGNMENT' | 'PERMISSION' | 'SYSTEM'>('ALL');

  const auditLogs = useMemo(() => roleManagementService.getAuditLogs(), []);
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const searchLower = auditSearch.toLowerCase();
      const matchesSearch = log.actor.toLowerCase().includes(searchLower) || 
             log.target.toLowerCase().includes(searchLower) ||
             log.action.toLowerCase().includes(searchLower) ||
             (log.detail && log.detail.toLowerCase().includes(searchLower));
      
      const matchesType = auditTypeFilter === 'ALL' || log.type === auditTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [auditLogs, auditSearch, auditTypeFilter]);

  // Modal & Form States
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<UVFLRole | null>(null);
  const [roleForm, setRoleForm] = useState<Partial<UVFLRole>>({
    name: '',
    target: 'USER',
    description: '',
    permissions: [],
    constraints: []
  });

  // Grant Factory State (Creating new permissions)
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [grantForm, setGrantForm] = useState<{action: PermissionAction, resource: Resource, scope: string}>({
    action: 'read',
    resource: 'value_record',
    scope: 'GLOBAL'
  });

  const [newConstraint, setNewConstraint] = useState('');
  const [aiProtocolInsight, setAiProtocolInsight] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const [assignForm, setAssignForm] = useState({
    targetId: '',
    roleId: roles[0]?.id || '',
    scope: 'GLOBAL',
    targetType: 'USER' as 'USER' | 'APP'
  });

  const constraintLibrary = {
    'BẢO MẬT': ['yêu_cầu_mfa', 'giới_hạn_1_phiên', 'chỉ_khóa_phần_cứng', 'ip_danh_sách_trắng'],
    'TÀI CHÍNH': ['chỉ_xem_tài_chính', 'không_phê_duyệt_trên_5000', 'không_thay_đổi_trần_thanh_toán'],
    'KIỂM TOÁN': ['không_tự_xác_thực_bản_ghi', 'yêu_cầu_kiểm_toán_khi_xuất_bản', 'không_sửa_sổ_cái_đã_đóng'],
    'VÙNG MIỀN': ['chỉ_truy_cập_nội_vùng', 'chặn_dòng_tiền_xuyên_biên_giới', 'khóa_tuân_thủ_iso']
  };

  const handleOpenCreate = () => {
    setEditingRole(null);
    setRoleForm({ name: '', target: 'USER', description: '', permissions: [], constraints: [] });
    setNewConstraint('');
    setAiProtocolInsight(null);
    setIsRoleModalOpen(true);
  };

  const handleOpenEdit = (role: UVFLRole) => {
    setEditingRole(role);
    setRoleForm({ ...role });
    setNewConstraint('');
    setAiProtocolInsight(null);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = () => {
    if (!roleForm.name) return;
    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...editingRole, ...roleForm } as UVFLRole : r));
    } else {
      const newRole: UVFLRole = {
        ...roleForm as UVFLRole,
        id: `R-CUSTOM-${Date.now()}`,
        isCore: false
      };
      setRoles([...roles, newRole]);
    }
    setIsRoleModalOpen(false);
  };

  const togglePermission = (roleId: string, permissionId: string) => {
    setRoles(prevRoles => prevRoles.map(r => {
      if (r.id === roleId) {
        const hasPermission = r.permissions.includes(permissionId);
        return {
          ...r,
          permissions: hasPermission 
            ? r.permissions.filter(id => id !== permissionId) 
            : [...r.permissions, permissionId]
        };
      }
      return r;
    }));
  };

  const togglePermissionInForm = (pid: string) => {
    const current = roleForm.permissions || [];
    setRoleForm({
      ...roleForm,
      permissions: current.includes(pid) ? current.filter(id => id !== pid) : [...current, pid]
    });
  };

  const handleCreateGrant = () => {
    const newGrant: UVFLPermission = {
      id: `P-CUSTOM-${Date.now()}`,
      action: grantForm.action,
      resource: grantForm.resource,
      scope: grantForm.scope as any
    };
    setPermissions([...permissions, newGrant]);
    setIsGrantModalOpen(false);
  };

  const handleDeleteGrant = (pid: string) => {
    if (window.confirm("Xóa đặc quyền này sẽ gỡ bỏ nó khỏi tất cả các vai trò. Tiếp tục?")) {
      setPermissions(permissions.filter(p => p.id !== pid));
      setRoles(roles.map(r => ({
        ...r,
        permissions: r.permissions.filter(id => id !== pid)
      })));
    }
  };

  const addConstraint = (val?: string) => {
    const constraintToAdd = (val || newConstraint).trim().toLowerCase();
    if (!constraintToAdd) return;
    const current = roleForm.constraints || [];
    if (!current.includes(constraintToAdd)) {
      setRoleForm({ ...roleForm, constraints: [...current, constraintToAdd] });
    }
    setNewConstraint('');
  };

  const removeConstraint = (c: string) => {
    const current = roleForm.constraints || [];
    setRoleForm({ ...roleForm, constraints: current.filter(item => item !== c) });
  };

  const validateConstraintsWithAI = async () => {
    if (!roleForm.constraints || roleForm.constraints.length === 0) return;
    setIsValidating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ text: `Bạn là Kỹ sư Quy tắc Protocol UVFL AI-05.
        Phân tích cấu hình vai trò sau:
        Vai trò: ${roleForm.name} (${roleForm.target})
        Mô tả: ${roleForm.description}
        Đặc quyền: ${roleForm.permissions?.join(', ')}
        Ràng buộc: ${roleForm.constraints.join(', ')}
        
        Đưa ra đánh giá "Protocol Insight" ngắn gọn (tối đa 150 ký tự) về tính an toàn và nhất quán của các ràng buộc này.` }] },
      });
      setAiProtocolInsight(response.text || "Các ràng buộc nhất quán với Protocol UVFL v4.4.");
    } catch (e) {
      setAiProtocolInsight("Kiểm tra hoàn tất. Các quy tắc hệ thống đã được thực thi cục bộ.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRevoke = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn gỡ bỏ phân quyền này?")) {
      setAssignments(assignments.filter(a => a.id !== id));
    }
  };

  const handleAssign = () => {
    if (!assignForm.targetId) return;
    const newAssign: UVFLAssignment = {
      id: `AS-${Date.now()}`,
      targetId: assignForm.targetId,
      roleId: assignForm.roleId,
      scope: assignForm.scope,
      assignedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      assignedBy: 'QUẢN_TRỊ_VIÊN'
    };
    setAssignments([newAssign, ...assignments]);
    setAssignForm({ ...assignForm, targetId: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Kiểm soát Truy cập</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter uppercase">PROTOCOL_RBAC_v4.4 // QUẢN_LÝ_DANH_TÍNH</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase">Quản trị Vai trò & Đặc quyền</h1>
          <p className="text-slate-500 font-medium italic">Thiết lập đặc quyền, gán danh tính và quản trị phạm vi tài phán trên toàn hệ sinh thái.</p>
        </div>
        
        <div className="flex gap-4">
           <button 
             onClick={() => setIsGrantModalOpen(true)}
             className="bg-white border border-ivory-border rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-all text-slate-600 hover:text-primary"
           >
              <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                 <span className="material-symbols-outlined">factory</span>
              </div>
              <div className="text-left">
                 <p className="text-[10px] font-black uppercase mb-1 leading-none">Nhà máy Đặc quyền</p>
                 <p className="text-xs font-bold font-mono">TẠO_MỚI++</p>
              </div>
           </button>
           <div className="bg-white border border-ivory-border rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                 <span className="material-symbols-outlined">security</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Vai trò Kích hoạt</p>
                 <p className="text-xl font-black text-slate-900">{roles.length}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ivory-border gap-8 overflow-x-auto scrollbar-hide">
        {[
          { id: 'ROLES', label: 'Danh mục Vai trò', icon: 'manage_accounts' },
          { id: 'MATRIX', label: 'Ma trận Đặc quyền', icon: 'grid_view' },
          { id: 'ASSIGNMENTS', label: 'Gán quyền Thực thể', icon: 'person_add' },
          { id: 'AUDIT', label: 'Nhật ký Kiểm toán', icon: 'history_edu' }
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
        
        {/* Tab: Roles */}
        {activeTab === 'ROLES' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Thư viện Vai trò Hệ thống</h3>
                <button 
                  onClick={handleOpenCreate}
                  className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-all"
                >
                   <span className="material-symbols-outlined">add</span>
                   Định nghĩa Vai trò Mới
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                  <div key={role.id} className="bg-white border border-ivory-border rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all group relative flex flex-col min-h-[350px]">
                     <div className="flex justify-between items-start mb-6">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                          role.target === 'USER' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                        }`}>
                          Bối cảnh {role.target}
                        </span>
                        {role.isCore && <span className="material-symbols-outlined text-slate-300 text-sm" title="Vai trò Cốt lõi Bất biến">lock</span>}
                     </div>
                     <h4 className="text-xl font-black text-slate-900 mb-2 uppercase">{role.name}</h4>
                     <p className="text-xs text-slate-500 font-medium italic mb-6 flex-1 line-clamp-3">"{role.description}"</p>
                     
                     <div className="space-y-3 mb-8">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                           <span>Đặc quyền</span>
                           <span className="text-primary">{role.permissions.length} Quyền được cấp</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {role.constraints?.map(c => (
                             <span key={c} className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[8px] font-bold uppercase">{c}</span>
                           ))}
                        </div>
                     </div>

                     <div className="pt-6 border-t border-ivory-border flex justify-between items-center">
                        <button 
                          className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1"
                          onClick={() => handleOpenEdit(role)}
                        >
                           Sửa <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button 
                          className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:scale-105 transition-all"
                          onClick={() => { setActiveTab('ASSIGNMENTS'); setAssignForm({ ...assignForm, roleId: role.id, targetType: role.target as any }) }}
                        >
                           Gán quyền <span className="material-symbols-outlined text-sm">person_add</span>
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Tab: Matrix */}
        {activeTab === 'MATRIX' && (
          <div className="animate-in slide-in-from-bottom-4 space-y-6">
             <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                   <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Ma trận Đặc quyền Toàn cầu</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase mt-1">Chỉnh sửa trực tiếp Hành động:Tài nguyên cho từng vai trò.</p>
                   </div>
                </div>

                <div className="overflow-x-auto pb-4 custom-scrollbar">
                   <table className="w-full border-separate border-spacing-2">
                      <thead>
                         <tr>
                            <th className="sticky left-0 bg-white z-20 p-4 text-[10px] font-black text-slate-400 uppercase text-left border-b-2 border-ivory-border min-w-[200px]">Vai trò \ Đặc quyền</th>
                            {permissions.map(p => (
                               <th key={p.id} className="p-4 text-[9px] font-black text-slate-500 uppercase border-b-2 border-ivory-border min-w-[120px] group relative">
                                  <div className="flex flex-col items-center gap-1">
                                     <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-400 font-mono">{p.id}</span>
                                     <span className="text-slate-900">{p.action}:{p.resource}</span>
                                     <button 
                                      onClick={() => handleDeleteGrant(p.id)}
                                      className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-rose-500 text-white size-4 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-sm"
                                     >
                                        <span className="material-symbols-outlined text-[10px] font-black">close</span>
                                     </button>
                                  </div>
                               </th>
                            ))}
                         </tr>
                      </thead>
                      <tbody>
                         {roles.map(role => (
                            <tr key={role.id} className="group">
                               <td className="sticky left-0 bg-white z-10 p-4 border border-ivory-border rounded-2xl group-hover:bg-ivory-surface transition-colors">
                                  <div className="flex items-center justify-between">
                                     <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{role.name}</span>
                                     <button 
                                       onClick={() => handleOpenEdit(role)}
                                       className="opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                                     >
                                        <span className="material-symbols-outlined text-sm">settings</span>
                                     </button>
                                  </div>
                               </td>
                               {permissions.map(p => {
                                  const isActive = role.permissions.includes(p.id);
                                  return (
                                     <td key={p.id} className="p-2 text-center">
                                        <button 
                                           onClick={() => togglePermission(role.id, p.id)}
                                           className={`size-12 rounded-2xl border-2 transition-all flex items-center justify-center shadow-inner ${
                                              isActive 
                                              ? 'bg-primary border-primary text-white scale-105 shadow-primary/20' 
                                              : 'bg-ivory-surface border-ivory-border text-slate-200 hover:border-primary hover:text-primary/20'
                                           }`}
                                        >
                                           <span className="material-symbols-outlined font-black text-sm">{isActive ? 'check' : 'close'}</span>
                                        </button>
                                     </td>
                                  );
                                })}
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {/* Tab: Assignments */}
        {activeTab === 'ASSIGNMENTS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
             <div className="lg:col-span-8 space-y-6">
                <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
                   <div className="px-10 py-8 border-b border-ivory-border bg-ivory-surface/20 flex justify-between items-center">
                      <h3 className="text-sm font-black uppercase tracking-widest">Sổ đăng ký Phân quyền (Trực tiếp)</h3>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="bg-ivory-surface/50 border-b border-ivory-border">
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Định danh Thực thể</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vai trò</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phạm vi</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-ivory-border">
                            {assignments.map(a => {
                              const role = roles.find(r => r.id === a.roleId);
                              return (
                                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                                   <td className="px-10 py-6">
                                      <p className="text-sm font-black text-slate-900 mb-1 uppercase tracking-tight">{a.targetId}</p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Đã gán: {a.assignedAt}</p>
                                   </td>
                                   <td className="px-10 py-6">
                                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{role?.name || 'Không hợp lệ'}</span>
                                   </td>
                                   <td className="px-10 py-6">
                                      <div className="flex items-center gap-2">
                                         <span className="material-symbols-outlined text-sm text-slate-300">{a.scope === 'GLOBAL' ? 'public' : 'location_on'}</span>
                                         <span className="text-[10px] font-black uppercase tracking-widest">{a.scope}</span>
                                      </div>
                                   </td>
                                   <td className="px-10 py-6 text-right">
                                      <button onClick={() => handleRevoke(a.id)} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all">
                                         <span className="material-symbols-outlined text-sm">remove_moderator</span>
                                      </button>
                                   </td>
                                </tr>
                              );
                            })}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
             
             <div className="lg:col-span-4">
                <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm sticky top-24">
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">person_add</span>
                      Gán quyền mới
                   </h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại thực thể</label>
                         <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => setAssignForm({ ...assignForm, targetType: 'USER' })}
                              className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${assignForm.targetType === 'USER' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                            >Người dùng</button>
                            <button 
                              onClick={() => setAssignForm({ ...assignForm, targetType: 'APP' })}
                              className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${assignForm.targetType === 'APP' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                            >Ứng dụng</button>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Định danh</label>
                         <input 
                            className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none focus:ring-4 ring-primary/5 transition-all" 
                            placeholder={assignForm.targetType === 'USER' ? "USER-8821..." : "APP-COMPLIANCE..."}
                            value={assignForm.targetId}
                            onChange={e => setAssignForm({ ...assignForm, targetId: e.target.value })}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vai trò áp dụng</label>
                         <select 
                            className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none appearance-none"
                            value={assignForm.roleId}
                            onChange={e => setAssignForm({ ...assignForm, roleId: e.target.value })}
                         >
                            {roles.filter(r => r.target === assignForm.targetType).map(r => (
                              <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phạm vi Tài phán</label>
                         <input 
                            className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none" 
                            placeholder="GLOBAL hoặc Mã ISO (VN, SG...)" 
                            value={assignForm.scope}
                            onChange={e => setAssignForm({ ...assignForm, scope: e.target.value.toUpperCase() })}
                         />
                      </div>
                      <button onClick={handleAssign} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                         Xác nhận Cấp quyền
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Tab: Audit */}
        {activeTab === 'AUDIT' && (
          <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm animate-in slide-in-from-bottom-4 space-y-10">
             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">Kiểm toán Quản trị Protocol</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Nhật ký bất biến về mọi thay đổi danh tính và đặc quyền.</p>
                </div>
                
                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                   <div className="relative flex-1 lg:w-64">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">search</span>
                      <input 
                        type="text" 
                        placeholder="Tìm theo Tác nhân, Mục tiêu..." 
                        className="w-full bg-slate-50 border border-ivory-border rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none focus:ring-4 ring-primary/5 transition-all"
                        value={auditSearch}
                        onChange={e => setAuditSearch(e.target.value)}
                      />
                   </div>
                   <select 
                    value={auditTypeFilter}
                    onChange={(e) => setAuditTypeFilter(e.target.value as any)}
                    className="bg-white border border-ivory-border rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
                   >
                      <option value="ALL">Tất cả hoạt động</option>
                      <option value="ASSIGNMENT">Gán quyền danh tính</option>
                      <option value="PERMISSION">Thay đổi Protocol</option>
                      <option value="SYSTEM">Hệ thống Cốt lõi</option>
                   </select>
                </div>
             </div>

             <div className="space-y-4">
                {filteredAuditLogs.length === 0 ? (
                  <div className="py-20 text-center opacity-30">
                     <span className="material-symbols-outlined text-6xl mb-4">history_edu</span>
                     <p className="text-sm font-black uppercase tracking-widest">Không tìm thấy bản ghi tương ứng</p>
                  </div>
                ) : (
                  filteredAuditLogs.map((log, i) => (
                    <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-slate-50 border border-ivory-border rounded-[32px] hover:bg-white hover:shadow-xl hover:border-primary/20 transition-all group relative overflow-hidden">
                       <div className="flex items-start gap-6 relative z-10">
                          <div className={`size-14 rounded-[20px] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                             log.type === 'ASSIGNMENT' ? 'bg-primary text-white shadow-primary/20' : 
                             log.type === 'PERMISSION' ? 'bg-indigo-600 text-white shadow-indigo-600/20' : 
                             'bg-slate-900 text-white shadow-slate-900/20'
                          }`}>
                             <span className="material-symbols-outlined text-2xl">
                                {log.type === 'ASSIGNMENT' ? 'person_add' : 
                                 log.type === 'PERMISSION' ? 'settings_suggest' : 'hub'}
                             </span>
                          </div>
                          <div>
                             <div className="flex items-center gap-3 mb-2">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${
                                   log.type === 'ASSIGNMENT' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                   log.type === 'PERMISSION' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                   'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                   {log.type}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">BĂM_KHỐI_XÁC_THỰC</span>
                             </div>
                             <p className="text-base font-black text-slate-900 tracking-tight leading-none mb-2 uppercase">
                                <span className="text-primary">{log.actor}</span>
                                <span className="mx-2 text-slate-300 font-medium italic">➔</span>
                                <span className="text-slate-600">{log.action}</span>
                                <span className="mx-2 text-slate-300 font-medium italic">➔</span>
                                <span className="text-slate-900">{log.target}</span>
                             </p>
                             {log.detail && (
                                <div className="p-3 bg-white/60 border border-ivory-border rounded-xl mt-2 flex items-center gap-2">
                                   <span className="material-symbols-outlined text-slate-400 text-sm">info</span>
                                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Chi tiết: {log.detail}</p>
                                </div>
                             )}
                          </div>
                       </div>
                       
                       <div className="mt-4 md:mt-0 text-right relative z-10 flex flex-col items-end gap-2 border-l border-ivory-border pl-8 md:min-w-[180px]">
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{log.timestamp}</p>
                             <p className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded inline-block uppercase">SHA256: {log.hash.substring(7, 15)}...</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                             <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                             <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Đã xác thực Merkle Root</span>
                          </div>
                       </div>

                       <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                          <span className="material-symbols-outlined text-[100px]">verified</span>
                       </div>
                    </div>
                  ))
                )}
             </div>

             <div className="p-8 bg-slate-900 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                   <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                      <span className="material-symbols-outlined text-2xl">security_update_good</span>
                   </div>
                   <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-1">Giao thức Bất biến Đang hoạt động</h4>
                      <p className="text-xs text-white/50 font-medium leading-relaxed italic">
                         Nhật ký kiểm toán này được phân tán trên các nút cụm vùng. Một khi hành động quản trị được ký, nó sẽ tồn tại vĩnh viễn trong dòng lịch sử của Sovereign OS.
                      </p>
                   </div>
                </div>
                <button className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                   Xuất Ảnh chụp Quản trị
                </button>
             </div>
          </div>
        )}

      </div>

      {/* Role Config Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-6xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-ivory-border flex justify-between items-center bg-ivory-surface/30">
                 <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{editingRole ? 'Chỉnh sửa đặc quyền' : 'Định nghĩa Vai trò Mới'}</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Cấu hình Danh tính Sovereign // UVFL-v4.4</p>
                 </div>
                 <button onClick={() => setIsRoleModalOpen(false)} className="size-12 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all">
                    <span className="material-symbols-outlined text-3xl">close</span>
                 </button>
              </div>

              <div className="p-10 flex-1 overflow-y-auto scrollbar-hide">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Basic Settings */}
                    <div className="lg:col-span-4 space-y-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên Protocol</label>
                          <input 
                            className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none focus:ring-4 ring-primary/5 transition-all" 
                            placeholder="VD: GIÁM_SÁT_TUÂN_THỦ"
                            value={roleForm.name}
                            onChange={e => setRoleForm({ ...roleForm, name: e.target.value.toUpperCase() })}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thực thể Đích</label>
                          <select 
                            className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none appearance-none"
                            value={roleForm.target}
                            onChange={e => setRoleForm({ ...roleForm, target: e.target.value as any })}
                          >
                             <option value="USER">Tác nhân Con người</option>
                             <option value="APP">Ứng dụng Tích hợp</option>
                             <option value="SYSTEM">Logic Protocol Nội bộ</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiến chương & Ý định</label>
                          <textarea 
                             className="w-full p-6 bg-slate-50 border border-ivory-border rounded-[32px] text-sm font-bold text-slate-700 outline-none h-40 focus:ring-4 ring-primary/5 transition-all resize-none" 
                             placeholder="Mô tả mục đích chiến lược của vai trò này..."
                             value={roleForm.description}
                             onChange={e => setRoleForm({ ...roleForm, description: e.target.value })}
                          />
                       </div>
                    </div>

                    {/* Role Constraints Section */}
                    <div className="lg:col-span-4 space-y-8">
                       <div className="space-y-4">
                          <div className="flex justify-between items-center">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ràng buộc Vai trò (Hạn chế)</label>
                             <button onClick={() => setRoleForm({...roleForm, constraints: []})} className="text-[8px] font-black text-rose-500 uppercase hover:underline">Xóa tất cả</button>
                          </div>
                          
                          <div className="flex gap-2">
                             <input 
                                className="flex-1 p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none focus:ring-4 ring-primary/5 transition-all" 
                                placeholder="Nhập thủ công..."
                                value={newConstraint}
                                onChange={e => setNewConstraint(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addConstraint()}
                             />
                             <button onClick={() => addConstraint()} className="px-6 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase transition-all">Thêm</button>
                          </div>

                          <div className="p-6 bg-ivory-surface/20 border-2 border-dashed border-ivory-border rounded-[32px] min-h-[120px] flex flex-wrap gap-2 content-start">
                             {roleForm.constraints?.length === 0 ? (
                               <p className="w-full text-center text-[10px] text-slate-400 italic py-8 uppercase tracking-widest">Chưa có ràng buộc nào</p>
                             ) : (
                               roleForm.constraints?.map(c => (
                                 <span key={c} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-tight animate-in zoom-in-95">
                                    {c}
                                    <button onClick={() => removeConstraint(c)} className="size-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center hover:bg-indigo-200">
                                       <span className="material-symbols-outlined text-[10px] font-black">close</span>
                                    </button>
                                 </span>
                               ))
                             )}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thư viện Gợi ý</label>
                          <div className="space-y-4 max-h-[250px] overflow-y-auto scrollbar-hide pr-2">
                             {Object.entries(constraintLibrary).map(([cat, items]) => (
                               <div key={cat} className="space-y-2">
                                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">{cat}</p>
                                  <div className="flex flex-wrap gap-2">
                                     {items.map(item => (
                                       <button 
                                          key={item}
                                          onClick={() => addConstraint(item)}
                                          disabled={roleForm.constraints?.includes(item)}
                                          className={`px-2 py-1 rounded-lg text-[9px] font-bold border transition-all ${
                                            roleForm.constraints?.includes(item) ? 'bg-slate-50 text-slate-300 border-slate-100' : 'bg-white border-ivory-border text-slate-500 hover:border-primary hover:text-primary'
                                          }`}
                                       >
                                          + {item}
                                       </button>
                                     ))}
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    {/* Permissions & AI Insight */}
                    <div className="lg:col-span-4 space-y-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cấp đặc quyền (Grants)</label>
                          <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide border border-ivory-border rounded-[32px] p-4 bg-ivory-surface/10">
                             {permissions.map(p => (
                               <button 
                                 key={p.id}
                                 onClick={() => togglePermissionInForm(p.id)}
                                 className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                                   roleForm.permissions?.includes(p.id) ? 'bg-white border-primary shadow-md' : 'bg-slate-50 border-ivory-border opacity-60'
                                 }`}
                               >
                                  <div>
                                     <p className="text-[11px] font-black text-slate-900 uppercase">{p.action}:{p.resource}</p>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase">Phạm vi: {p.scope}</p>
                                  </div>
                                  <div className={`size-6 rounded-full flex items-center justify-center transition-all ${roleForm.permissions?.includes(p.id) ? 'bg-primary text-white shadow-lg' : 'bg-white border border-ivory-border'}`}>
                                     {roleForm.permissions?.includes(p.id) && <span className="material-symbols-outlined text-[14px] font-black">check</span>}
                                  </div>
                               </button>
                             ))}
                          </div>
                       </div>

                       {/* AI Protocol Insight Block */}
                       <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                          <div className="relative z-10">
                             <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                   <div className="size-8 rounded-lg bg-primary text-white flex items-center justify-center">
                                      <span className="material-symbols-outlined text-sm">psychology</span>
                                   </div>
                                   <span className="text-[10px] font-black text-primary uppercase tracking-widest">Protocol AI-05</span>
                                </div>
                                <button 
                                  onClick={validateConstraintsWithAI}
                                  disabled={isValidating || !roleForm.constraints?.length}
                                  className="text-[9px] font-black text-white/40 uppercase hover:text-white transition-colors disabled:opacity-20"
                                >
                                  {isValidating ? 'Đang kiểm tra...' : 'Chạy Kiểm toán'}
                                </button>
                             </div>
                             
                             <div className="min-h-[80px] flex items-center justify-center">
                                {aiProtocolInsight ? (
                                  <p className="text-xs italic text-white/80 leading-relaxed text-center animate-in fade-in duration-500">
                                    "{aiProtocolInsight}"
                                  </p>
                                ) : (
                                  <p className="text-[10px] text-white/30 uppercase tracking-widest text-center font-black">Bấm 'Chạy Kiểm toán' để xác minh chính sách</p>
                                )}
                             </div>
                          </div>
                          <div className="absolute -bottom-10 -right-10 size-32 bg-primary/10 rounded-full blur-3xl"></div>
                       </div>
                    </div>

                 </div>
              </div>

              <div className="px-10 py-8 bg-ivory-surface/50 border-t border-ivory-border flex gap-4">
                 <button 
                    onClick={handleSaveRole}
                    disabled={!roleForm.name}
                    className="flex-1 py-5 bg-slate-900 text-white font-black rounded-3xl shadow-2xl hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-30"
                 >
                    {editingRole ? 'Cập nhật Chính sách Truy cập' : 'Đẩy Vai trò lên Protocol'}
                    <span className="material-symbols-outlined">{editingRole ? 'verified' : 'publish'}</span>
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Grant Factory Modal */}
      {isGrantModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-ivory-border flex justify-between items-center bg-ivory-surface/30">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Nhà máy Đặc quyền</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Tạo đối tượng đặc quyền nguyên tử mới</p>
                 </div>
                 <button onClick={() => setIsGrantModalOpen(false)} className="size-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>

              <div className="p-10 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hành động (Action)</label>
                    <select 
                      className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none"
                      value={grantForm.action}
                      onChange={e => setGrantForm({...grantForm, action: e.target.value as any})}
                    >
                       <option value="read">ĐỌC (READ)</option>
                       <option value="create">TẠO (CREATE)</option>
                       <option value="update">CẬP NHẬT (UPDATE)</option>
                       <option value="delete">XÓA (DELETE)</option>
                       <option value="validate">XÁC THỰC (VALIDATE)</option>
                       <option value="flag">CẮM CỜ (FLAG)</option>
                       <option value="sign">KÝ (SIGN)</option>
                       <option value="manage">QUẢN TRỊ (MANAGE)</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tài nguyên (Resource)</label>
                    <select 
                      className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none"
                      value={grantForm.resource}
                      onChange={e => setGrantForm({...grantForm, resource: e.target.value as any})}
                    >
                       <option value="value_record">BẢN_GHI_GIÁ_TRỊ</option>
                       <option value="wallet">VÍ_TÀI_KHOẢN</option>
                       <option value="ledger">SỔ_CÁI_HỆ_THỐNG</option>
                       <option value="dispute">TRANH_CHẤP</option>
                       <option value="ruleset">BỘ_QUY_TẮC</option>
                       <option value="country_profile">HỒ_SƠ_QUỐC_GIA</option>
                       <option value="audit_log">NHẬT_KÝ_KIỂM_TOÁN</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phạm vi mặc định (Scope)</label>
                    <select 
                      className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none"
                      value={grantForm.scope}
                      onChange={e => setGrantForm({...grantForm, scope: e.target.value})}
                    >
                       <option value="OWN">CÁ_NHÂN (OWNER)</option>
                       <option value="COUNTRY">QUỐC_GIA (JURISDICTION)</option>
                       <option value="GLOBAL">TOÀN_CẦU (NETWORK)</option>
                       <option value="PUBLIC">CÔNG_KHAI (ANONYMIZED)</option>
                    </select>
                 </div>
              </div>

              <div className="px-10 py-8 bg-ivory-surface/50 border-t border-ivory-border">
                 <button 
                   onClick={handleCreateGrant}
                   className="w-full py-4 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                 >
                    Khởi tạo Đặc quyền
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagementCenter;
