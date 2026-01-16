
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../App';
import { governorService, PolicyConflict, CountryProfileData } from '../../services/governor';

const CountryProfile = () => {
  const { t } = useLanguage();
  const ct = t.country;

  const [activeSection, setActiveSection] = useState('general');
  const [isAuditing, setIsAuditing] = useState(false);
  const [conflicts, setConflicts] = useState<PolicyConflict[]>([]);
  const [aiInsight, setAiInsight] = useState('');
  const [showJsonExport, setShowJsonExport] = useState(false);

  const [formData, setFormData] = useState<CountryProfileData>({
    version: '4.2.0',
    country_name: 'Vietnam',
    iso_code: 'VN',
    default_asset: 'USDT',
    allowed_assets: ['USDT', 'GOLD', 'VND'],
    gold_unit: 'Grams',
    reward_enabled: false,
    tax: {
      vat: 10,
      gold_duty: 5
    }
  });

  const runAudit = async () => {
    setIsAuditing(true);
    const result = await governorService.auditConfiguration(formData);
    setConflicts(result.conflicts);
    setAiInsight(result.insight);
    setIsAuditing(false);
  };

  const handleCreateNewVersion = () => {
    const newProfile = governorService.createNewVersion(formData, {});
    setFormData(newProfile);
    // Tự động audit ngay sau khi tạo bản mới
    runAudit();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      {/* Sidebar: Governor Control */}
      <aside className="w-full lg:w-80 shrink-0 space-y-6">
        <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <span className="material-symbols-outlined text-teal-400">gavel</span>
               <h3 className="text-xs font-black uppercase tracking-widest text-teal-400">Governor Command</h3>
            </div>
            
            <div className="mb-8">
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Active Version</p>
              <h2 className="text-3xl font-black tracking-tighter">v{formData.version}</h2>
            </div>

            <button 
              onClick={handleCreateNewVersion}
              className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-teal-500/20 mb-4"
            >
              Tạo phiên bản v{formData.version.split('.').map((v, i) => i === 1 ? Number(v) + 1 : v).join('.').replace(/\.\d$/, '.0')}
            </button>

            <button 
              onClick={() => setShowJsonExport(!showJsonExport)}
              className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              {showJsonExport ? 'Đóng Export' : 'Xuất Payload JSON'}
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 size-40 bg-teal-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Consistency Check</span>
              <span className={`size-2 rounded-full ${conflicts.some(c => c.type === 'ERROR') ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
           </div>

           <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide">
              {conflicts.length > 0 ? (
                conflicts.map((c, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${c.type === 'ERROR' ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
                    <p className={`text-[10px] font-black uppercase mb-1 ${c.type === 'ERROR' ? 'text-rose-600' : 'text-amber-600'}`}>{c.type}</p>
                    <p className="text-xs font-bold text-slate-800 leading-tight mb-2">{c.message}</p>
                    <p className="text-[9px] text-slate-500 italic">Resolve: {c.resolution}</p>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center opacity-30">
                   <span className="material-symbols-outlined text-4xl mb-2">verified</span>
                   <p className="text-xs font-bold uppercase tracking-widest">Profile Validated</p>
                </div>
              )}
           </div>

           <button 
            onClick={runAudit}
            disabled={isAuditing}
            className="w-full mt-6 py-3 border border-ivory-border text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 disabled:opacity-50"
           >
            {isAuditing ? 'Auditing...' : 'Run Full Validation'}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {showJsonExport ? (
          <div className="bg-slate-900 rounded-[40px] p-8 text-emerald-400 font-mono text-xs overflow-hidden shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">JSON Payload v{formData.version}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(formData, null, 2))}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                </button>
             </div>
             <pre className="max-h-[500px] overflow-y-auto scrollbar-hide whitespace-pre-wrap">
               {JSON.stringify(formData, null, 2)}
             </pre>
          </div>
        ) : (
          <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm space-y-12">
            {/* General Settings */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">public</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">{ct.sections.general}</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Core Identity & Assets</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Quốc gia</label>
                  <input className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-primary/20" value={formData.country_name} onChange={e => setFormData({...formData, country_name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ISO Code</label>
                  <input className="w-full p-4 bg-slate-100 border border-ivory-border rounded-2xl text-sm font-bold text-slate-500" value={formData.iso_code} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tài sản mặc định</label>
                  <select className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none" value={formData.default_asset} onChange={e => setFormData({...formData, default_asset: e.target.value})}>
                    <option value="USDT">USDT (Stable)</option>
                    <option value="GOLD">GOLD (Commodity)</option>
                    <option value="VND">VND (National)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Đơn vị Vàng</label>
                  <input className="w-full p-4 bg-slate-50 border border-ivory-border rounded-2xl text-sm font-bold outline-none" value={formData.gold_unit} onChange={e => setFormData({...formData, gold_unit: e.target.value})} placeholder="e.g. Grams" />
                </div>
              </div>
            </section>

            {/* Constraints */}
            <section className="pt-12 border-t border-ivory-border">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Ràng buộc & Chính sách</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Reward & Security Modules</p>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border border-ivory-border rounded-[32px] flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-slate-800">Reward Token System</p>
                  <p className="text-xs text-slate-500 font-medium">Bật module thù lao bằng Token cho người dùng.</p>
                </div>
                <button 
                  onClick={() => setFormData({...formData, reward_enabled: !formData.reward_enabled})}
                  className={`size-12 rounded-2xl flex items-center justify-center transition-all ${
                    formData.reward_enabled ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined">{formData.reward_enabled ? 'check_circle' : 'do_not_disturb_on'}</span>
                </button>
              </div>

              {formData.iso_code === 'VN' && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                  <span className="material-symbols-outlined text-amber-500 text-sm">info</span>
                  <p className="text-[11px] text-amber-800 font-medium italic">
                    Lưu ý: Theo chính sách Governor hiện tại cho vùng VN, việc bật Reward Token yêu cầu chứng minh tuân thủ Tài sản Số.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryProfile;
