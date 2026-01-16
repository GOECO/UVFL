
import React, { useState } from 'react';
import { useLanguage } from '../../App';

const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-4 mb-6 pt-4 first:pt-0">
    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <h3 className="text-lg font-black text-slate-900 leading-none">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold opacity-70">{subtitle}</p>
    </div>
  </div>
);

/**
 * Fix: Added default value for 'children' to resolve TypeScript errors where 'children'
 * was inferred as a required property but not explicitly passed as a named attribute in JSX.
 */
const FormField = ({ label, children = null, colSpan = "col-span-1" }) => (
  <div className={`${colSpan}`}>
    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{label}</label>
    {children}
  </div>
);

const Input = (props) => (
  <input 
    {...props}
    className="w-full bg-white border border-ivory-border rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300"
  />
);

const Select = ({ options, ...props }) => (
  <select 
    {...props}
    className="w-full bg-white border border-ivory-border rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer appearance-none"
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`w-10 h-5 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-slate-200'}`} />
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
    <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{label}</span>
  </label>
);

const CountryProfile = () => {
  const { t } = useLanguage();
  const ct = t.country;

  const [formData, setFormData] = useState({
    country_name: 'Vietnam',
    iso_code: 'VN',
    language_default: 'vi',
    timezone_default: 'UTC+7',
    rounding_rule: '2',
    default_asset_type: 'NATIONAL_CURRENCY',
    national_currency_code: 'VND',
    allowed_assets: ['USDT', 'GOLD', 'NATIONAL_CURRENCY', 'REWARD_TOKEN'],
    gold_unit: 'gram',
    tax: {
      vat_gst_rate: 10,
      income_tax_rate: 20,
      corporate_tax_rate: 20,
      withholding_rate: 5
    },
    customs: {
      enabled: true,
      duty_rate_default: 5,
      hs_code_mapping: [
        { hs: '8471', rate: 0, desc: 'Computers' },
        { hs: '8517', rate: 0, desc: 'Phones' }
      ],
      deminimis_threshold: 1000000
    },
    invoice: {
      einvoice_required: true,
      invoice_fields_required: ['tax_id', 'address', 'email']
    },
    kyc_aml_level: 'advanced',
    data_residency_required: true,
    reward_token_enabled: true,
    notes: 'Standard profile for VN operations v4.2',
    version: '4.2.0',
    effective_from: '2024-01-01'
  });

  const handleToggleAsset = (asset) => {
    setFormData(prev => ({
      ...prev,
      allowed_assets: prev.allowed_assets.includes(asset) 
        ? prev.allowed_assets.filter(a => a !== asset)
        : [...prev.allowed_assets, asset]
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{ct.title}</h1>
          <p className="text-slate-500 font-medium mt-1">{ct.subtitle}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 border border-ivory-border bg-white text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all">
            Hủy
          </button>
          <button className="px-8 py-3 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            Lưu thay đổi
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section: General */}
        <div className="bg-white border border-ivory-border rounded-[32px] p-8 shadow-sm">
          <SectionHeader icon="public" title={ct.sections.general} subtitle="Core identification" />
          <div className="grid grid-cols-4 gap-6">
            <FormField label={ct.fields.name} colSpan="col-span-2">
              <Input value={formData.country_name} onChange={e => setFormData({...formData, country_name: e.target.value})} />
            </FormField>
            <FormField label={ct.fields.iso}>
              <Input value={formData.iso_code} onChange={e => setFormData({...formData, iso_code: e.target.value})} />
            </FormField>
            <FormField label={ct.fields.lang}>
              <Select 
                value={formData.language_default} 
                onChange={e => setFormData({...formData, language_default: e.target.value})}
                options={[{value:'vi', label:'Tiếng Việt'}, {value:'en', label:'English'}, {value:'jp', label:'Japanese'}]}
              />
            </FormField>
            <FormField label={ct.fields.timezone}>
              <Input value={formData.timezone_default} onChange={e => setFormData({...formData, timezone_default: e.target.value})} />
            </FormField>
          </div>
        </div>

        {/* Section: Assets */}
        <div className="bg-white border border-ivory-border rounded-[32px] p-8 shadow-sm">
          <SectionHeader icon="currency_exchange" title={ct.sections.assets} subtitle="Asset engine configuration" />
          <div className="grid grid-cols-3 gap-6 mb-8">
            <FormField label={ct.fields.currency}>
              <Input value={formData.national_currency_code} onChange={e => setFormData({...formData, national_currency_code: e.target.value})} />
            </FormField>
            <FormField label={ct.fields.defaultAsset}>
              <Select 
                value={formData.default_asset_type}
                onChange={e => setFormData({...formData, default_asset_type: e.target.value})}
                options={[
                  {value:'NATIONAL_CURRENCY', label:'National Currency'},
                  {value:'USDT', label:'USDT (Stablecoin)'},
                  {value:'GOLD', label:'Gold'}
                ]}
              />
            </FormField>
            <FormField label={ct.fields.goldUnit}>
              <Select 
                value={formData.gold_unit}
                onChange={e => setFormData({...formData, gold_unit: e.target.value})}
                options={[{value:'gram', label:'Gram'}, {value:'chi', label:'Chỉ (VN)'}, {value:'ounce', label:'Ounce'}]}
              />
            </FormField>
          </div>
          <FormField label={ct.fields.allowedAssets}>
            <div className="flex flex-wrap gap-3 mt-2">
              {['USDT', 'GOLD', 'NATIONAL_CURRENCY', 'REWARD_TOKEN'].map(asset => (
                <button
                  key={asset}
                  onClick={() => handleToggleAsset(asset)}
                  className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                    formData.allowed_assets.includes(asset) 
                    ? 'bg-primary border-primary text-white shadow-md' 
                    : 'bg-white border-ivory-border text-slate-400'
                  }`}
                >
                  {asset}
                </button>
              ))}
            </div>
          </FormField>
        </div>

        {/* Grid for Tax & Customs */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-ivory-border rounded-[32px] p-8 shadow-sm">
            <SectionHeader icon="receipt_long" title={ct.sections.tax} subtitle="Compliance rates" />
            <div className="grid grid-cols-2 gap-6">
              <FormField label={ct.fields.vat}>
                <Input type="number" value={formData.tax.vat_gst_rate} />
              </FormField>
              <FormField label={ct.fields.incomeTax}>
                <Input type="number" value={formData.tax.income_tax_rate} />
              </FormField>
              <FormField label={ct.fields.corporateTax}>
                <Input type="number" value={formData.tax.corporate_tax_rate} />
              </FormField>
              <FormField label={ct.fields.withholding}>
                <Input type="number" value={formData.tax.withholding_rate} />
              </FormField>
            </div>
          </div>

          <div className="bg-white border border-ivory-border rounded-[32px] p-8 shadow-sm">
            <SectionHeader icon="local_shipping" title={ct.sections.customs} subtitle="Import & Border control" />
            <div className="space-y-6">
              <Toggle 
                label={ct.fields.customsEnabled} 
                checked={formData.customs.enabled} 
                onChange={() => setFormData({...formData, customs: {...formData.customs, enabled: !formData.customs.enabled}})}
              />
              <div className="grid grid-cols-2 gap-6">
                <FormField label={ct.fields.dutyRate}>
                  <Input type="number" disabled={!formData.customs.enabled} value={formData.customs.duty_rate_default} />
                </FormField>
                <FormField label={ct.fields.threshold}>
                  <Input type="number" disabled={!formData.customs.enabled} value={formData.customs.deminimis_threshold} />
                </FormField>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Compliance & Invoice */}
        <div className="bg-white border border-ivory-border rounded-[32px] p-8 shadow-sm">
          <SectionHeader icon="verified_user" title={ct.sections.compliance} subtitle="Legal & Privacy rules" />
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-6">
              <Toggle 
                label={ct.fields.einvoice} 
                checked={formData.invoice.einvoice_required} 
                onChange={() => setFormData({...formData, invoice: {...formData.invoice, einvoice_required: !formData.invoice.einvoice_required}})}
              />
              <Toggle 
                label={ct.fields.residency} 
                checked={formData.data_residency_required} 
                onChange={() => setFormData({...formData, data_residency_required: !formData.data_residency_required})}
              />
              <Toggle 
                label={ct.fields.reward} 
                checked={formData.reward_token_enabled} 
                onChange={() => setFormData({...formData, reward_token_enabled: !formData.reward_token_enabled})}
              />
            </div>
            <FormField label={ct.fields.kyc} colSpan="col-span-2">
              <div className="flex gap-4 mt-2">
                {['none', 'basic', 'advanced'].map(level => (
                  <button
                    key={level}
                    onClick={() => setFormData({...formData, kyc_aml_level: level})}
                    className={`flex-1 py-4 rounded-2xl border transition-all text-sm font-black uppercase tracking-widest ${
                      formData.kyc_aml_level === level 
                      ? 'bg-primary/5 border-primary text-primary shadow-inner' 
                      : 'bg-white border-ivory-border text-slate-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </FormField>
          </div>
        </div>

        {/* Section: Versioning */}
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl text-white relative overflow-hidden">
          <SectionHeader icon="history" title={ct.sections.version} subtitle="Control & Validity" />
          <div className="grid grid-cols-3 gap-6 relative z-10">
            <FormField label={ct.fields.version}>
              <input className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-primary/40 outline-none" value={formData.version} readOnly />
            </FormField>
            <FormField label={ct.fields.effectiveFrom}>
              <input type="date" className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-primary/40 outline-none" value={formData.effective_from} onChange={e => setFormData({...formData, effective_from: e.target.value})} />
            </FormField>
            <FormField label={ct.fields.notes}>
              <input className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-primary/40 outline-none" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
            </FormField>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-30" />
        </div>
      </div>
    </div>
  );
};

export default CountryProfile;
