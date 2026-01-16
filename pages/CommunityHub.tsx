
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { communityService, ValidatorNode } from '../services/community';

const CommunityHub = () => {
  const { t } = useLanguage();
  const [nodes, setNodes] = useState<ValidatorNode[]>([]);
  const [trustScore, setTrustScore] = useState(94);
  const [isMeshActive, setIsMeshActive] = useState(false);

  useEffect(() => {
    setNodes(communityService.getNearbyNodes());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">P2P Mesh Network</span>
            <span className="text-slate-400 text-xs font-bold font-mono">AGENT: COMMUNITY_11</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Trung tâm Cộng đồng & Offline</h1>
          <p className="text-slate-500 mt-2 font-medium italic">"Sự tin tưởng được xác thực cục bộ, sự đồng thuận ghi nhận toàn cầu."</p>
        </div>
        
        <button 
          onClick={() => setIsMeshActive(!isMeshActive)}
          className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center gap-3 ${
            isMeshActive ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-900 text-white shadow-slate-900/20'
          }`}
        >
          {isMeshActive ? 'Đang dò tìm Mesh...' : 'Kích hoạt Offline Mesh'}
          <span className={`material-symbols-outlined ${isMeshActive ? 'animate-spin' : ''}`}>
            {isMeshActive ? 'sync' : 'wifi_tethering'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trust Score & Profile */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Điểm Uy tín cá nhân (VRS)</p>
              <div className="flex items-center justify-center py-8">
                 <div className="relative size-40 flex items-center justify-center">
                    <svg className="size-full -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-purple-600" strokeDasharray="440" strokeDashoffset={440 - (440 * trustScore / 100)} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-4xl font-black text-slate-900">{trustScore}</span>
                 </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Cấp độ: TRUSTED VALIDATOR</p>
                <p className="text-xs text-slate-400 font-medium">Bạn nằm trong top 5% Nút có độ tin cậy cao nhất.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
             <h4 className="text-sm font-black uppercase tracking-widest text-purple-400 mb-6">Quy tắc Đồng thuận</h4>
             <ul className="space-y-4">
                {[
                  { icon: 'task_alt', text: 'Cần tối thiểu 3 chữ ký Peer' },
                  { icon: 'history', text: 'Đồng bộ tối đa sau 24h' },
                  { icon: 'gavel', text: 'Slashing 10% nếu sai lệch hash' }
                ].map((rule, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-medium text-white/70">
                    <span className="material-symbols-outlined text-purple-400 text-sm">{rule.icon}</span>
                    {rule.text}
                  </li>
                ))}
             </ul>
          </div>
        </div>

        {/* Nearby Nodes & Tasks */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
             <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
               <span className="material-symbols-outlined text-primary">diversity_3</span>
               Mạng lưới Nút lân cận (P2P Mesh)
             </h3>
             <div className="space-y-4">
                {nodes.map(node => (
                  <div key={node.id} className="flex items-center justify-between p-6 bg-slate-50 border border-ivory-border rounded-3xl hover:bg-white hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                       <div className={`size-12 rounded-2xl flex items-center justify-center text-white ${node.vrs > 95 ? 'bg-emerald-500' : 'bg-primary'}`}>
                         <span className="material-symbols-outlined">{node.status === 'online' ? 'sensors' : 'hub'}</span>
                       </div>
                       <div>
                         <p className="font-black text-slate-900 tracking-tight">{node.name}</p>
                         <p className="text-[10px] font-mono text-slate-400 uppercase">{node.id} • VRS: {node.vrs}%</p>
                       </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                         node.status === 'online' ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600'
                       }`}>
                         {node.status}
                       </span>
                       <span className="text-[10px] text-slate-300 font-bold">{node.lastSync}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-[48px] p-10 relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-lg font-black text-purple-900 mb-4 tracking-tight">Đồng bộ hóa Ngoại tuyến</h3>
                <p className="text-sm text-purple-700 font-medium leading-relaxed max-w-xl mb-8">
                  Hệ thống đang lưu giữ 3 bản ghi giá trị chưa đồng bộ. Các bản ghi này đã được xác thực bởi 4 Nút lân cận thông qua Bluetooth.
                </p>
                <div className="flex gap-4">
                   <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-600/20 hover:scale-105 transition-all">
                     Đồng bộ Mainnet ngay
                   </button>
                   <button className="px-6 py-3 bg-white border border-purple-200 text-purple-600 rounded-xl font-black text-xs uppercase tracking-widest">
                     Xem Hàng đợi Offline
                   </button>
                </div>
             </div>
             <div className="absolute top-0 right-0 p-10 opacity-10">
               <span className="material-symbols-outlined text-[120px] text-purple-900">cloud_upload</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
