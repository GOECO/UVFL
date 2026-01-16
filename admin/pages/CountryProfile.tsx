
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../App';
import { governorService, PolicyConflict, CountryProfileData } from '../../services/governor';

const SectionHeader = ({ icon, title, subtitle }: { icon: string, title: string, subtitle: string }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">{title}</h3>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{subtitle}</p>
    </div>
  </div>
);

const FormInput = ({ label, value, onChange, type = "text", disabled = false, suffix = "" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
    <div className="relative">
      <input 
        type={type}
        className={`w-full p-4 border rounded-2xl text-sm font-bold outline-none focus:ring-4 ring-primary/5 transition-all ${
          disabled ? 'bg-slate-50 border-ivory-border text-slate-400' : 'bg-white border-ivory-border text-slate-800'
        }`} 
        value={value} 
        onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        disabled={disabled}
      />
      {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">{suffix}</span>}
    </div>
  </div>
);

const CountryProfile = () => {
  const { t } = useLanguage();
  const [selectedIso, setSelectedIso] = useState('VN');
  const [formData, setFormData] = useState<CountryProfileData>(governorService.getInitialData('VN'));
  const [isAuditing, setIsAuditing] = useState(false);
  const [conflicts, setConflicts] = useState<PolicyConflict[]>([]);
  const [showJsonExport, setShowJsonExport] = useState(false);

  useEffect(() => {
    setFormData(governorService.getInitialData(selectedIso));
    setConflicts([]);
  }, [selectedIso]);

  const runAudit = async () => {
    setIsAuditing(true);
    const result = await governorService.auditConfiguration(formData);
    setConflicts(result.conflicts);
    setIsAuditing(false);
  };

  const handleSave = () => {
    const newProfile = governorService.createNewVersion(formData, {});
    setFormData(newProfile);
    alert(`Phiên bản v${newProfile.version} đã được chuẩn bị cho đồng thuận Mainnet.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      
      {/* Sidebar: Regional Selector & HUD */}
      <aside className="w-full lg:w-80 shrink-0 space-y-6">
        <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
               <span className="material-symbols-outlined text-sm">public</span>
               Jurisdiction Switch
            </h3>
            
            <select 
              value={selectedIso}
              onChange={(e) => setSelectedIso(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm font-black outline-none mb-8 appearance-none cursor-pointer"
            >
              <option value="VN" className="text-slate-900">Vietnam (VN)</option>
              <option value="SG" className="text-slate-900">Singapore (SG)</option>
              <option value="DE" className="text-slate-900">Germany (DE)</option>
            </select>

            <div className="mb-8">
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Active Version</p>
              <h2 className="text-3xl font-black tracking-tighter">v{formData.version}</h2>
            </div>

            <button 
              onClick={handleSave}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20 mb-4 hover:scale-[1.02] active:scale-95"
            >
              Commit New Version
            </button>

            <button 
              onClick={() => setShowJsonExport(!showJsonExport)}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              {showJsonExport ? 'Close Data View' : 'Inspect JSON Payload'}
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 size-40 bg-primary/10 rounded-full blur-3xl"></div>
        </div>

        {/* AI Audit Status */}
        <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Policy Audit</span>
              <span className={`size-2 rounded-full ${conflicts.length > 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
           </div>

           <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide">
              {conflicts.length > 0 ? (
                conflicts.map((c, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${c.type === 'ERROR' ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
                    <p className={`text-[9px] font-black uppercase mb-1 ${c.type === 'ERROR' ? 'text-rose-600' : 'text-amber-600'}`}>{c.type}</p>
                    <p className="text-xs font-bold text-slate-800 leading-tight mb-2">{c.message}</p>
                    <p className="text-[9px] text-slate-500 italic font-medium">Fix: {c.resolution}</p>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center opacity-30">
                   <span className="material-symbols-outlined text-4xl mb-2 text-primary">verified</span>
                   <p className="text-xs font-bold uppercase tracking-widest">Protocol Validated</p>
                </div>
              )}
           </div>

           <button 
            onClick={runAudit}
            disabled={isAuditing}
            className="w-full mt-6 py-3 border border-ivory-border text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center gap-2"
           >
            {isAuditing ? 'Analyzing Protocol...' : 'Run Consistency Check'}
            <span className="material-symbols-outlined text-sm">psychology</span>
           </button>
        </div>
      </aside>

      {/* Main Content: Configuration Grid */}
      <div className="flex-1 space-y-6">
        {showJsonExport ? (
          <div className="bg-slate-900 rounded-[48px] p-10 text-emerald-400 font-mono text-xs overflow-hidden shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Technical Schema v{formData.version}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(formData, null, 2))}
                  className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Copy Payload</span>
                </button>
             </div>
             <pre className="max-h-[600px] overflow-y-auto scrollbar-hide whitespace-pre-wrap leading-relaxed opacity-80">
               {JSON.stringify(formData, null, 2)}
             </pre>
          </div>
        ) : (
          <div className="bg-white border border-ivory-border rounded-[48px] p-12 shadow-sm space-y-16">
            
            {/* General Identification */}
            <section>
              <SectionHeader icon="settings" title="Hạch toán & Nhận dạng" subtitle="Core Jurisdiction Parameters" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FormInput label="Country Name" value={formData.country_name} onChange={(v:any) => setFormData({...formData, country_name: v})} />
                <FormInput label="ISO Code" value={formData.iso_code} disabled />
                <FormInput label="Timezone" value={formData.timezone} onChange={(v:any) => setFormData({...formData, timezone: v})} />
                <FormInput label="Default Asset" value={formData.default_asset} onChange={(v:any) => setFormData({...formData, default_asset: v})} />
                <FormInput label="Currency Code" value={formData.currency_code} onChange={(v:any) => setFormData({...formData, currency_code: v})} />
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Rounding Rule</label>
                  <select 
                    value={formData.rounding_rule}
                    onChange={(e) => setFormData({...formData, rounding_rule: e.target.value as any})}
                    className="w-full bg-white border border-ivory-border rounded-2xl p-4 text-sm font-bold outline-none appearance-none"
                  >
                    <option value="NEAREST">Nearest Integer</option>
                    <option value="UP">Always Round Up</option>
                    <option value="DOWN">Always Round Down</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Fiscal Configuration (Taxes) */}
            <section className="pt-12 border-t border-ivory-border">
              <SectionHeader icon="payments" title="Ma trận Thuế" subtitle="Fiscal Policy Enforcement" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <FormInput type="number" label="VAT / GST Rate" suffix="%" value={formData.tax_config.vat} onChange={(v:any) => setFormData({...formData, tax_config: {...formData.tax_config, vat: v}})} />
                <FormInput type="number" label="Corporate Tax" suffix="%" value={formData.tax_config.corporate} onChange={(v:any) => setFormData({...formData, tax_config: {...formData.tax_config, corporate: v}})} />
                <FormInput type="number" label="Withholding" suffix="%" value={formData.tax_config.withholding} onChange={(v:any) => setFormData({...formData, tax_config: {...formData.tax_config, withholding: v}})} />
                <FormInput type="number" label="Income Tax (Base)" suffix="%" value={formData.tax_config.income} onChange={(v:any) => setFormData({...formData, tax_config: {...formData.tax_config, income: v}})} />
              </div>
            </section>

            {/* Customs & Trade */}
            <section className="pt-12 border-t border-ivory-border">
              <SectionHeader icon="local_shipping" title="Hải quan & Thương mại" subtitle="Import/Export Gateway Logic" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4 bg-slate-50 border border-ivory-border p-6 rounded-3xl">
                   <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Customs Enforcement</p>
                      <button 
                        onClick={() => setFormData({...formData, customs_config: {...formData.customs_config, enabled: !formData.customs_config.enabled}})}
                        className={`size-10 rounded-xl flex items-center justify-center transition-all ${formData.customs_config.enabled ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-200 text-slate-400'}`}
                      >
                         <span className="material-symbols-outlined text-sm">{formData.customs_config.enabled ? 'check' : 'close'}</span>
                      </button>
                   </div>
                   <p className="text-[10px] text-slate-400 font-medium italic">Kích hoạt các module kiểm soát hàng hóa và thuế nhập khẩu tại biên giới.</p>
                </div>
                <FormInput type="number" label="Default Duty Rate" suffix="%" value={formData.customs_config.duty_rate} onChange={(v:any) => setFormData({...formData, customs_config: {...formData.customs_config, duty_rate: v}})} />
                <FormInput type="number" label="De-minimis Threshold" suffix={formData.currency_code} value={formData.customs_config.threshold} onChange={(v:any) => setFormData({...formData, customs_config: {...formData.customs_config, threshold: v}})} />
              </div>
            </section>

            {/* Compliance & Security */}
            <section className="pt-12 border-t border-ivory-border">
              <SectionHeader icon="verified_user" title="Tuân thủ & Bảo mật" subtitle="KYC & Data Sovereignty Levels" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">KYC/AML Mandatory Level</label>
                  <select 
                    value={formData.compliance_config.kyc_level}
                    onChange={(e) => setFormData({...formData, compliance_config: {...formData.compliance_config, kyc_level: Number(e.target.value) as any}})}
                    className="w-full bg-white border border-ivory-border rounded-2xl p-4 text-sm font-bold outline-none appearance-none"
                  >
                    <option value={1}>Tier 1 (Basic)</option>
                    <option value={2}>Tier 2 (Identity Proof)</option>
                    <option value={3}>Tier 3 (Enhanced Due Diligence)</option>
                  </select>
                </div>

                {[
                  { key: 'residency_required', label: 'Data Residency', icon: 'home_pin', desc: 'Sovereign local storage' },
                  { key: 'einvoice_required', label: 'E-Invoice Req.', icon: 'description', desc: 'Mandatory digital receipt' }
                ].map((item) => (
                  <div key={item.key} className="p-6 bg-slate-50 border border-ivory-border rounded-3xl flex flex-col justify-between">
                     <div className="flex justify-between items-center mb-4">
                        <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                        <button 
                          onClick={() => setFormData({...formData, compliance_config: {...formData.compliance_config, [item.key]: !formData.compliance_config[item.key as keyof typeof formData.compliance_config]}})}
                          className={`size-8 rounded-lg flex items-center justify-center transition-all ${formData.compliance_config[item.key as keyof typeof formData.compliance_config] ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-200 text-slate-400'}`}
                        >
                           <span className="material-symbols-outlined text-sm">check</span>
                        </button>
                     </div>
                     <p className="text-[10px] font-black text-slate-900 uppercase mb-1">{item.label}</p>
                     <p className="text-[9px] text-slate-400 italic font-medium">{item.desc}</p>
                  </div>
                ))}

                <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl">
                   <div className="flex items-center gap-2 text-amber-700 mb-2">
                      <span className="material-symbols-outlined text-sm">warning</span>
                      <p className="text-[10px] font-black uppercase">Local Constraint</p>
                   </div>
                   <p className="text-[9px] text-amber-800 font-medium leading-relaxed italic">
                      Yêu cầu Data Residency sẽ chặn mọi hành vi xuất khẩu dữ liệu TEE ra khỏi cụm nút regional.
                   </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryProfile;
