
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { interopService, CompatibilityMatrix } from '../services/interop';

const InteroperabilityCenter = () => {
  const { t } = useLanguage();
  const [matrix, setMatrix] = useState<CompatibilityMatrix[]>([]);
  const [activeSpec, setActiveSpec] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMatrix(interopService.getCompatibilityMatrix());
    const loadSpec = async () => {
      const result = await interopService.generateMappingSpec('SAP ERP');
      setActiveSpec(result);
      setIsLoading(false);
    };
    loadSpec();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Global Standardization</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">AGENT: INTEROP_17 // OPEN_PROTOCOL</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Tương thích & Chuẩn hóa</h1>
          <p className="text-slate-500 mt-2 font-medium italic">"Mở để kết nối mọi hệ thống giá trị trên thế giới."</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-ivory-border p-4 rounded-3xl flex items-center gap-4 shadow-sm">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Version</p>
                <p className="text-xl font-black text-slate-900">v4.2.0-STABLE</p>
              </div>
              <span className="material-symbols-outlined text-2xl text-slate-500">integration_instructions</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Compatibility Matrix */}
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                   <span className="material-symbols-outlined text-slate-600">hub</span>
                   Ma trận Tương thích Hệ thống
                 </h3>
                 <button className="px-6 py-2 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">add</span>
                   Yêu cầu Connector mới
                 </button>
              </div>

              <div className="space-y-4">
                 {matrix.map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-slate-50 border border-ivory-border rounded-3xl hover:bg-white hover:shadow-md transition-all group">
                     <div className="flex items-center gap-6">
                        <div className={`size-12 rounded-2xl flex items-center justify-center text-white ${
                          item.status === 'FULL' ? 'bg-emerald-500' : item.status === 'PARTIAL' ? 'bg-amber-500' : 'bg-slate-400'
                        }`}>
                          <span className="material-symbols-outlined">
                            {item.system.includes('Ethereum') ? 'link' : 'settings_input_component'}
                          </span>
                        </div>
                        <div>
                          <p className="font-black text-slate-800 tracking-tight leading-none mb-1 uppercase">{item.system}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mapping: {item.mappingLogic}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          item.status === 'FULL' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {item.status} SUPPORT
                        </span>
                        <p className="text-[8px] font-mono text-slate-300 mt-1 uppercase">Hash: {item.connectorHash.substring(0, 12)}...</p>
                     </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
              <h3 className="text-sm font-black uppercase tracking-widest text-teal-400 mb-8 flex items-center gap-2">
                 <span className="material-symbols-outlined">code</span>
                 UVFL Open Protocol Spec (Preview)
              </h3>
              <div className="p-8 bg-black/40 border border-white/5 rounded-3xl font-mono text-[11px] text-teal-400/80 leading-relaxed max-h-[300px] overflow-y-auto scrollbar-hide">
                 <pre>{`{
  "protocol": "UVFL",
  "version": "4.2.0",
  "auth": { "type": "MTLS", "provider": "SovereignNode" },
  "endpoints": {
    "POST /v1/records": { "desc": "Atomic Value Creation", "idempotency": true },
    "GET /v1/audit/{hash}": { "desc": "Immutable Proof Check" },
    "POST /v1/cross-border/settle": { "desc": "ISO-20022 Encapsulation" }
  },
  "schemas": {
    "ValueRecord": {
      "type": "object",
      "required": ["amount", "asset", "proof_hash", "sovereign_iso"],
      "properties": { ... }
    }
  }
}`}</pre>
              </div>
              <div className="mt-8 flex gap-4">
                 <button className="px-6 py-3 bg-teal-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-600/20">
                   Tải về OpenAPI Spec
                 </button>
                 <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-black text-xs uppercase tracking-widest">
                   API Sandbox
                 </button>
              </div>
              <div className="absolute -bottom-24 -right-24 size-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>
           </div>
        </div>

        {/* Right Column: Standards & Guidelines */}
        <div className="lg:col-span-5 space-y-8">
           
           <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">AI Mapping Insight (SAP ERP)</h3>
              <div className="p-6 bg-slate-50 border border-ivory-border rounded-3xl mb-8">
                 <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-emerald-500 text-sm">verified</span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase">ISO-20022 Aligned</span>
                 </div>
                 <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                   "{isLoading ? "Đang tạo tài liệu mapping..." : activeSpec?.spec}"
                 </p>
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compatibility Score</p>
                 <div className="flex items-end justify-between mb-4">
                    <p className="text-3xl font-black text-slate-900">{activeSpec?.compatibility || '--'}%</p>
                    <span className="text-[10px] font-black text-emerald-500 uppercase">EXCELLENT</span>
                 </div>
                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${activeSpec?.compatibility || 0}%` }}></div>
                 </div>
              </div>
           </div>

           <div className="bg-teal-600 rounded-[48px] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest mb-6">Nguyên tắc Standard AI-17</h4>
                 <ul className="space-y-4">
                    {[
                      { icon: 'open_in_new', text: 'Open Standard (OpenAPI)' },
                      { icon: 'history', text: 'Backward Compatibility' },
                      { icon: 'sync_alt', text: 'Vendor Neutrality' },
                      { icon: 'shield', text: 'Secure Bridge Enforcement' }
                    ].map((principle, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-medium text-white/80">
                         <span className="material-symbols-outlined text-white/50 text-sm">{principle.icon}</span>
                         {principle.text}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <span className="material-symbols-outlined text-[120px]">dynamic_form</span>
              </div>
           </div>

           <div className="bg-ivory-surface border border-ivory-border rounded-[40px] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Version Lifecycle</h3>
              <div className="space-y-3">
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">v4.2 (Current)</span>
                    <span className="text-emerald-500 font-black uppercase tracking-widest">ACTIVE</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">v4.1 (Legacy)</span>
                    <span className="text-slate-400 font-black uppercase tracking-widest">MAINTENANCE</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">v3.x (Legacy)</span>
                    <span className="text-rose-500 font-black uppercase tracking-widest">SUNSET</span>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default InteroperabilityCenter;
