
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../App';

interface UserIdentity {
  id: string;
  fullName: string;
  email: string;
  role: 'CREATOR' | 'OPERATOR' | 'GUIDE';
  kycLevel: 1 | 2 | 3;
  isoCountry: string;
  vrs: number; // Validator Reputation Score
  joinedAt: string;
  teeStatus: 'SECURED' | 'UNENCRYPTED';
  walletAddress: string;
  phone?: string;
  taxId?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

const ProfileManagementCenter = () => {
  const { t, isDark } = useLanguage();
  const [user, setUser] = useState<UserIdentity>({
    id: 'USER-7782-X9',
    fullName: 'Nguyễn Văn A',
    email: 'van.a@uvfl.io',
    role: 'OPERATOR',
    kycLevel: 2,
    isoCountry: 'VN',
    vrs: 94.5,
    joinedAt: '2023-12-15',
    teeStatus: 'SECURED',
    walletAddress: '0x71fb...e91c',
    phone: '+84 901 *** 882',
    taxId: 'TX-VN-992102***',
    verificationStatus: 'VERIFIED'
  });

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'REGISTRATION' | 'SECURITY' | 'DATA_RIGHTS'>('OVERVIEW');

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Identity Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="size-32 rounded-[40px] bg-slate-900 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
               <span className="text-4xl font-black text-white">{user.fullName.charAt(0)}</span>
            </div>
            <div className="absolute -bottom-2 -right-2 size-10 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
               <span className="material-symbols-outlined text-xl">verified</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Sovereign Identity</span>
              <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter uppercase">{user.id}</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase">{user.fullName}</h1>
            <p className="text-slate-500 font-medium italic">{user.email} • {user.isoCountry} Jurisdiction</p>
          </div>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-ivory-border rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                 <span className="material-symbols-outlined">military_tech</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Trust Score (VRS)</p>
                 <p className="text-xl font-black text-slate-900">{user.vrs}%</p>
              </div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ivory-border gap-8 overflow-x-auto scrollbar-hide">
        {[
          { id: 'OVERVIEW', label: 'Tổng quan danh tính', icon: 'account_circle' },
          { id: 'REGISTRATION', label: 'Thông tin đăng ký', icon: 'app_registration' },
          { id: 'SECURITY', label: 'Bảo mật & TEE', icon: 'shield_lock' },
          { id: 'DATA_RIGHTS', label: 'Chủ quyền dữ liệu', icon: 'database' }
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Contextual Bento */}
        <div className="lg:col-span-8 space-y-8">
          
          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
               {/* Role Card */}
               <div className="bg-slate-900 text-white rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Vai trò giao thức</p>
                    <h3 className="text-4xl font-black tracking-tighter mb-6">{user.role}</h3>
                    <div className="space-y-4 border-t border-white/10 pt-6">
                       <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-white/40">Chu kỳ thăng tiến tiếp theo</span>
                          <span className="text-emerald-400">14 ngày</span>
                       </div>
                       <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '65%' }} />
                       </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 size-40 bg-primary/10 rounded-full blur-3xl"></div>
               </div>

               {/* Compliance Card */}
               <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Trạng thái tuân thủ</p>
                  <div className="flex items-center gap-6 mb-8">
                     <div className="size-16 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-black text-2xl">
                        {user.kycLevel}
                     </div>
                     <div>
                        <h4 className="font-black text-slate-900 uppercase">KYC Tier {user.kycLevel}</h4>
                        <p className="text-xs text-slate-500 font-medium">Hạn mức giao dịch: $50,000/tháng</p>
                     </div>
                  </div>
                  <button className="w-full py-3 bg-slate-50 border border-ivory-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                     Nâng cấp lên Tier 3
                  </button>
               </div>

               {/* Wallet Context */}
               <div className="md:col-span-2 bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Ví định danh (Identity Wallet)</h3>
                     <code className="text-[10px] font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">{user.walletAddress}</code>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {[
                       { label: 'USDT', val: '1,240.50', color: 'bg-blue-500' },
                       { label: 'GOLD', val: '42.15g', color: 'bg-amber-500' },
                       { label: 'VND', val: '15.0M', color: 'bg-rose-500' },
                       { label: 'REWARD', val: '850', color: 'bg-emerald-500' }
                     ].map(asset => (
                       <div key={asset.label} className="p-4 bg-slate-50 border border-ivory-border rounded-3xl">
                          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">{asset.label}</p>
                          <p className="text-sm font-black text-slate-900">{asset.val}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'REGISTRATION' && (
            <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm animate-in slide-in-from-bottom-4">
               <div className="flex justify-between items-center mb-10 border-b border-ivory-border pb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Chi tiết hồ sơ đăng ký</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-widest">Sovereign Account Registration Data</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span className="text-[10px] font-black uppercase">Verified</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ và tên (Legal Name)</label>
                    <p className="text-lg font-black text-slate-900 uppercase">{user.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại định danh</label>
                    <p className="text-lg font-black text-slate-900">{user.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Khu vực tài phán (Jurisdiction)</label>
                    <div className="flex items-center gap-2">
                       <span className="text-lg font-black text-slate-900">Vietnam (VN)</span>
                       <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-500">ISO-3166</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã số thuế / Định danh pháp lý</label>
                    <p className="text-lg font-black text-slate-900 font-mono tracking-tight">{user.taxId}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2 pt-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Địa chỉ lưu trú (Data Residency)</label>
                    <div className="p-6 bg-slate-50 border border-ivory-border rounded-3xl flex items-start gap-4">
                       <span className="material-symbols-outlined text-slate-400">home_pin</span>
                       <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                         Địa chỉ này được mã hóa và chỉ phục vụ cho việc tính toán thuế VAT/GST địa phương. Toàn bộ dữ liệu residency được lưu trữ tại Nút cục bộ VN-NODE-77.
                       </p>
                    </div>
                  </div>
               </div>

               <div className="mt-12 pt-10 border-t border-ivory-border">
                  <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all">
                     Cập nhật thông tin đăng ký
                  </button>
               </div>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
               <div className="bg-slate-900 text-white rounded-[48px] p-10 shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-6 mb-10">
                     <div className="size-20 rounded-[32px] bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                        <span className="material-symbols-outlined text-4xl">lock</span>
                     </div>
                     <div>
                        <h3 className="text-2xl font-black tracking-tight uppercase">Hardware-Level Encryption</h3>
                        <p className="text-xs text-white/40 font-bold uppercase tracking-widest">TEE Status: {user.teeStatus}</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="p-6 bg-white/5 border border-white/10 rounded-3xl font-mono text-[11px] text-emerald-400/80 leading-relaxed">
                        <p className="flex gap-4"><span className="text-white/20">DEVICE_ID</span> <span>TEE-VN-7782-HW-SECURE</span></p>
                        <p className="flex gap-4"><span className="text-white/20">PUB_KEY_S</span> <span>{user.walletAddress}</span></p>
                        <p className="flex gap-4"><span className="text-white/20">ENCLAVE</span> <span>VERIFIED_ACTIVE</span></p>
                     </div>
                  </div>
               </div>
               
               <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-8">Cấu hình bảo mật</h3>
                  <div className="space-y-6">
                     {[
                       { label: 'Xác thực khuôn mặt (FaceID/Biometric)', status: 'ENABLED', icon: 'face' },
                       { label: 'Khóa TEE cục bộ', status: 'ENABLED', icon: 'phonelink_lock' },
                       { label: 'Chữ ký đa tầng (Multi-sig)', status: 'DISABLED', icon: 'group_work' }
                     ].map(item => (
                       <div key={item.label} className="flex items-center justify-between p-4 bg-slate-50 border border-ivory-border rounded-2xl">
                          <div className="flex items-center gap-4">
                             <span className="material-symbols-outlined text-slate-400">{item.icon}</span>
                             <span className="text-xs font-bold text-slate-700">{item.label}</span>
                          </div>
                          <button className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${
                            item.status === 'ENABLED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'
                          }`}>
                             {item.status}
                          </button>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'DATA_RIGHTS' && (
             <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm animate-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-10">
                   <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Quyền kiểm soát dữ liệu</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase mt-1">GDPR & Sovereign Protocol v4.2</p>
                   </div>
                   <span className="material-symbols-outlined text-indigo-600 text-4xl">policy</span>
                </div>
                <div className="space-y-8">
                   <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl">
                      <h4 className="text-sm font-black text-indigo-900 uppercase mb-4">Dữ liệu được lưu trữ (Data Residency)</h4>
                      <div className="flex items-center gap-4">
                         <div className="size-12 rounded-2xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600">
                            <span className="material-symbols-outlined">location_on</span>
                         </div>
                         <p className="text-xs text-indigo-800 font-medium leading-relaxed">
                            Mọi dữ liệu định danh và bằng chứng của bạn đang được lưu trữ tại <b>Cụm nút Việt Nam (VN-NODE-CLUSTER)</b>. Dữ liệu này không bao giờ rời khỏi khu vực tài phán trừ khi có yêu cầu xuất khẩu thủ công.
                         </p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="flex flex-col items-center justify-center p-8 bg-slate-900 text-white rounded-[32px] gap-4 hover:scale-[1.02] transition-all">
                         <span className="material-symbols-outlined text-3xl">download</span>
                         <span className="text-xs font-black uppercase tracking-widest text-center">Yêu cầu xuất dữ liệu (Right to Export)</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-8 border-2 border-rose-100 text-rose-600 bg-rose-50 rounded-[32px] gap-4 hover:scale-[1.02] transition-all">
                         <span className="material-symbols-outlined text-3xl">delete_forever</span>
                         <span className="text-xs font-black uppercase tracking-widest text-center">Yêu cầu ẩn danh hóa (Right to Forgotten)</span>
                      </button>
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* Right Sidebar: Stats & Activity */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* VRS Progress */}
           <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Node Performance</h3>
              <div className="relative size-40 mx-auto mb-8 flex items-center justify-center">
                 <svg className="size-full -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-primary" strokeDasharray="440" strokeDashoffset={440 - (440 * user.vrs / 100)} strokeLinecap="round" />
                 </svg>
                 <div className="absolute text-center">
                    <p className="text-2xl font-black text-slate-900">{user.vrs}%</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase">Stability</p>
                 </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-ivory-border">
                 <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-400 uppercase">Uptime</span>
                    <span className="text-slate-900">99.9%</span>
                 </div>
                 <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-400 uppercase">Validation Delay</span>
                    <span className="text-slate-900">2.4m</span>
                 </div>
              </div>
           </div>

           {/* Personal Ledger Feed */}
           <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 uppercase">Personal Audit Trail</h3>
              <div className="space-y-6">
                 {[
                   { action: 'UPDATE_PROFILE', time: '2h ago', status: 'HASHED' },
                   { action: 'VALIDATE_REC', time: '5h ago', status: 'HASHED' },
                   { action: 'SIGN_BLOCK', time: '1d ago', status: 'HASHED' }
                 ].map((log, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex flex-col">
                         <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight group-hover:text-primary transition-colors">{log.action}</span>
                         <span className="text-[9px] text-slate-400 font-bold">{log.time}</span>
                      </div>
                      <span className="text-[8px] font-mono font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">{log.status}</span>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                 Tải Ledger cá nhân <span className="material-symbols-outlined text-xs">download</span>
              </button>
           </div>

           {/* Invariant Rule */}
           <div className="bg-amber-50 border border-amber-100 rounded-[40px] p-8">
              <div className="flex items-center gap-2 mb-4 text-amber-700">
                 <span className="material-symbols-outlined text-sm">lock</span>
                 <p className="text-[10px] font-black uppercase">Quy tắc danh tính v4.2</p>
              </div>
              <p className="text-[10px] text-amber-800 font-medium leading-relaxed italic">
                 "Mọi thay đổi đối với Identity Wallet phải được xác thực thông qua TEE Hardware Key. Hệ thống UVFL không lưu trữ mật khẩu tĩnh (Static Passwords)."
              </p>
           </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileManagementCenter;
