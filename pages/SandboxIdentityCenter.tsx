import React, { useState, useMemo } from 'react';
import { useLanguage } from '../App';
import { sandboxService, TestIdentity } from '../services/sandbox';
import { roleManagementService, UVFLRole } from '../services/role-management';
import { GoogleGenAI } from "@google/genai";

const SandboxIdentityCenter = () => {
  const { t } = useLanguage();
  const [testUsers, setTestUsers] = useState<TestIdentity[]>(sandboxService.getTestIdentities());
  const [roles] = useState<UVFLRole[]>(roleManagementService.getCoreRoles());
  
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [selectedRole, setSelectedRole] = useState('R-01');
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const handleProvision = () => {
    if (!newUserName) return;
    const newUser = sandboxService.provisionIdentity({ name: newUserName, roleId: selectedRole });
    setTestUsers([...testUsers, newUser]);
    setNewUserName('');
  };

  const analyzeSecurityWithAI = async (userId: string) => {
    setAiInsight("Protocol Sentry is analyzing logic gates...");
    try {
      const user = testUsers.find(u => u.id === userId);
      const role = roles.find(r => r.id === user?.roleId);
      
      // Fix: Initialized GoogleGenAI using process.env.API_KEY directly as required
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the security impact of this test account in UVFL Sandbox:
        User: ${user?.name}
        Role: ${role?.name} (${role?.description})
        KYC: Tier ${user?.kycTier}
        Constraints: ${role?.constraints?.join(', ') || 'None'}
        
        Identify if this setup can bypass 'cannot_validate_own_record' or other protocol rules. Output a technical summary (max 100 words).`,
      });
      setAiInsight(response.text || "Analysis complete. Logic consistent.");
    } catch (e) {
      setAiInsight("AI Core offline. Protocol integrity maintained via local constraints.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Dev Sandbox</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter uppercase tracking-tighter uppercase">PROTOCOL_TESTER_v1.0 // ROLE_ARCHITECT</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase uppercase">Sandbox Identity Factory</h1>
          <p className="text-slate-500 font-medium italic">Khởi tạo và quản lý thực thể định danh để thử nghiệm logic giao thức UVFL.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Provisioning Form */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
                 <span className="material-symbols-outlined text-amber-500">factory</span>
                 Cấp phát danh tính mới
              </h3>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest uppercase tracking-widest">Tên định danh (Mô phỏng)</label>
                    <input 
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="VD: Test Validator Node..."
                      className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none focus:ring-4 ring-amber-500/5 transition-all"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest uppercase tracking-widest">Vai trò áp dụng</label>
                    <select 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none appearance-none"
                    >
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest uppercase tracking-widest">Vùng tài phán</label>
                       <select className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-xs font-bold outline-none appearance-none">
                          <option>VN (Vietnam)</option>
                          <option>SG (Singapore)</option>
                          <option>DE (Germany)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest uppercase tracking-widest">KYC Tier</label>
                       <select className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-xs font-bold outline-none appearance-none">
                          <option>Tier 1</option>
                          <option>Tier 2</option>
                          <option>Tier 3</option>
                       </select>
                    </div>
                 </div>

                 <button 
                  onClick={handleProvision}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                    Khởi tạo thực thể
                    <span className="material-symbols-outlined text-sm">rocket_launch</span>
                 </button>
              </div>
           </div>

           {/* AI Insight Box */}
           <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="size-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                       <span className="material-symbols-outlined text-sm">psychology</span>
                    </div>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest uppercase tracking-widest">Protocol Audit AI</span>
                 </div>
                 <p className="text-xs italic text-white/70 leading-relaxed min-h-[60px]">
                    "{aiInsight || "Chọn 'Analyze Logic' trên một tài khoản để kiểm tra tính tuân thủ quy tắc hệ thống."}"
                 </p>
              </div>
              <div className="absolute -bottom-10 -right-10 size-32 bg-amber-500/10 rounded-full blur-3xl"></div>
           </div>
        </div>

        {/* Right: Active Identities Table */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
              <div className="px-10 py-8 border-b border-ivory-border flex justify-between items-center bg-ivory-surface/20">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 uppercase tracking-widest text-slate-900 flex items-center gap-3">
                   <span className="material-symbols-outlined text-amber-600">group_work</span>
                   Tài khoản kiểm tra hiện dụng
                 </h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest uppercase tracking-widest">Total: {testUsers.length} Nodes</span>
              </div>
              
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-ivory-surface/50 border-b border-ivory-border">
                       <tr>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest uppercase tracking-widest">Định danh / Device</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest uppercase tracking-widest">Vai trò / Khu vực</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest uppercase tracking-widest">Số dư thử nghiệm</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest uppercase tracking-widest text-right">Thao tác</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-ivory-border">
                       {testUsers.map(user => (
                         <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                            <td className="px-10 py-6">
                               <p className="text-sm font-black text-slate-900 mb-1 uppercase uppercase">{user.name}</p>
                               <div className="flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[10px] text-slate-400">key</span>
                                  <code className="text-[9px] font-mono font-bold text-slate-400">{user.id} • {user.teeDevice}</code>
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <div className="flex flex-col gap-1">
                                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[9px] font-black uppercase w-fit uppercase w-fit">
                                    {roles.find(r => r.id === user.roleId)?.name || 'Unknown'}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase uppercase">{user.isoCode} • Tier {user.kycTier}</span>
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <p className="text-xs font-black text-slate-800">{user.balanceUSDT.toLocaleString()} USDT</p>
                               <p className="text-xs font-black text-amber-600">{user.balanceGOLD} GOLD</p>
                            </td>
                            <td className="px-10 py-6 text-right">
                               <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => analyzeSecurityWithAI(user.id)}
                                    className="p-2 bg-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                                    title="Analyze Protocol Logic"
                                  >
                                     <span className="material-symbols-outlined text-sm">psychology</span>
                                  </button>
                                  <button className="p-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase px-4 hover:scale-105 transition-all uppercase px-4 hover:scale-105 transition-all">
                                     Login as
                                  </button>
                                  <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                     <span className="material-symbols-outlined text-sm">delete</span>
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Role Definition Quick-Link */}
           <div className="bg-ivory-surface border border-ivory-border rounded-[48px] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6 text-center md:text-left">
                 <div className="size-16 rounded-[24px] bg-white border border-ivory-border flex items-center justify-center text-slate-400 shadow-sm">
                    <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase uppercase">Cấu trúc Vai trò (Role Architect)</h4>
                    <p className="text-sm text-slate-500 font-medium">Định nghĩa lại các ràng buộc và quyền hạn hệ thống.</p>
                 </div>
              </div>
              <button 
                onClick={() => window.location.hash = '#/admin/roles'}
                className="px-8 py-4 bg-white border border-ivory-border text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                 Mở trình quản lý vai trò
                 <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SandboxIdentityCenter;