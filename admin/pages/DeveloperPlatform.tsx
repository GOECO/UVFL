
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../App';
import { developerPlatformService, DeveloperApp, APIScope, APIUsageMetric } from '../../services/developer-platform';

const DeveloperPlatform = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'APPS' | 'METRICS' | 'DOCS'>('APPS');
  const [apps, setApps] = useState<DeveloperApp[]>(developerPlatformService.getApps());
  const [metrics] = useState<APIUsageMetric[]>(developerPlatformService.getUsageMetrics());
  const [selectedApp, setSelectedApp] = useState<DeveloperApp | null>(null);

  const avgLatency = useMemo(() => 
    metrics.length > 0 ? Math.round(metrics.reduce((sum, m) => sum + m.latency, 0) / metrics.length) : 0
  , [metrics]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header & Global Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Extension Layer</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">OPEN_API_v1.4 // AUTH_GATEWAY</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase">Developer Platform</h1>
          <p className="text-slate-500 font-medium italic">Cổng quản trị dành cho các đối tác tích hợp hệ sinh thái giá trị UVFL.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-ivory-border rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4">
              <div className="size-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                 <span className="material-symbols-outlined">hub</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Integrations</p>
                 <p className="text-xl font-black text-slate-900">{apps.length}</p>
              </div>
           </div>
           <div className="bg-white border border-ivory-border rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4">
              <div className="size-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                 <span className="material-symbols-outlined">speed</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Avg Net Latency</p>
                 <p className="text-xl font-black text-emerald-600">{avgLatency}ms</p>
              </div>
           </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-ivory-border gap-8 overflow-x-auto scrollbar-hide">
        {[
          { id: 'APPS', label: 'Registered Apps', icon: 'apps' },
          { id: 'METRICS', label: 'Traffic & Quotas', icon: 'monitoring' },
          { id: 'DOCS', label: 'API Reference', icon: 'menu_book' }
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
        
        {/* Tab 1: App Management */}
        {activeTab === 'APPS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
             <div className="lg:col-span-8 space-y-6">
                <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
                   <div className="px-10 py-8 border-b border-ivory-border flex justify-between items-center bg-ivory-surface/20">
                      <h3 className="text-sm font-black uppercase tracking-widest">Active Partner Applications</h3>
                      <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:scale-105 transition-all">Create App ID</button>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-ivory-surface/50 border-b border-ivory-border">
                            <tr>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">App / Developer</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Env</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quota Usage</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-ivory-border">
                            {apps.map(app => (
                              <tr key={app.id} 
                                  onClick={() => setSelectedApp(app)}
                                  className={`group hover:bg-slate-50 transition-colors cursor-pointer ${selectedApp?.id === app.id ? 'bg-primary/5' : ''}`}>
                                 <td className="px-10 py-6">
                                    <p className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">{app.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{app.developer} • {app.id}</p>
                                 </td>
                                 <td className="px-10 py-6">
                                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                                      app.environment === 'PRODUCTION' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                       {app.environment}
                                    </span>
                                 </td>
                                 <td className="px-10 py-6">
                                    <div className="w-32 space-y-1">
                                       <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
                                          <span>Calls</span>
                                          <span>{Math.round((app.currentUsage/app.dailyQuota)*100)}%</span>
                                       </div>
                                       <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                          <div className="h-full bg-primary" style={{ width: `${(app.currentUsage/app.dailyQuota)*100}%` }} />
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-10 py-6 text-right">
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                      app.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                       {app.status}
                                    </span>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-6">
                {selectedApp ? (
                  <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm animate-in slide-in-from-right-4 duration-300">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">App Secret Vault</h3>
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">API Key</label>
                           <code className="block p-4 bg-slate-900 text-emerald-400 text-[10px] font-mono rounded-2xl truncate border border-white/5">{selectedApp.apiKey}</code>
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Enabled Scopes</label>
                           <div className="flex flex-wrap gap-2">
                              {selectedApp.scopes.map(s => (
                                <span key={s} className={`px-2 py-1 text-[9px] font-black rounded border ${
                                  s.includes('write') || s.includes('validate') ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                }`}>
                                   {s} { (s.includes('write') || s.includes('validate')) && '🔒' }
                                </span>
                              ))}
                           </div>
                        </div>
                        <div className="pt-6 border-t border-ivory-border space-y-3">
                           <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors">Rotate Secret</button>
                           <button className="w-full py-3 border border-rose-200 text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-colors">Revoke Access</button>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="bg-ivory-surface/50 border border-ivory-border border-dashed rounded-[48px] py-20 text-center">
                     <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">settings_remote</span>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select an app to manage keys</p>
                  </div>
                )}

                <div className="bg-slate-900 text-white rounded-[40px] p-8 relative overflow-hidden group">
                   <div className="relative z-10">
                      <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-2">
                         <span className="material-symbols-outlined text-lg">policy</span>
                         API Security Rule #1
                      </h4>
                      <p className="text-xs text-white/60 font-medium leading-relaxed italic">
                         "External applications are strictly prohibited from executing value distributions or overriding system roles. Any detected attempt will result in immediate IP banning."
                      </p>
                   </div>
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <span className="material-symbols-outlined text-[120px]">security</span>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Tab 2: Traffic Metrics */}
        {activeTab === 'METRICS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
             <div className="lg:col-span-8 space-y-8">
                <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
                   <div className="flex justify-between items-center mb-10">
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
                         <span className="material-symbols-outlined text-primary">analytics</span>
                         Real-time API Traffic
                      </h3>
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase animate-pulse">Live</span>
                   </div>
                   <div className="flex items-end gap-3 h-64 border-b border-ivory-border pb-4">
                      {[12, 45, 67, 34, 89, 56, 110, 45, 78, 120, 65, 45, 90, 110, 34, 56, 78].map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                           <div className="w-full bg-slate-100 rounded-t-lg transition-all group-hover:bg-primary group-hover:scale-y-105 origin-bottom" style={{ height: `${(v/120)*100}%` }} />
                           <span className="text-[7px] font-black text-slate-300 hidden group-hover:block">{i}h</span>
                        </div>
                      ))}
                   </div>
                   <div className="mt-10 grid grid-cols-3 gap-8">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Requests (24h)</p>
                         <p className="text-2xl font-black text-slate-900">482.5K</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Success Rate</p>
                         <p className="text-2xl font-black text-emerald-600">99.98%</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Throttled</p>
                         <p className="text-2xl font-black text-rose-500">214</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
                   <div className="px-10 py-8 border-b border-ivory-border bg-ivory-surface/20">
                      <h3 className="text-sm font-black uppercase tracking-widest">Global API Audit Ledger</h3>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="bg-ivory-surface/50 border-b border-ivory-border">
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp / App</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Endpoint</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Latency</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-ivory-border">
                            {metrics.map((log, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition-colors">
                                 <td className="px-10 py-6">
                                    <p className="text-xs font-black text-slate-900 mb-1 uppercase">{log.appId}</p>
                                    <p className="text-[9px] font-mono text-slate-400">{log.timestamp}</p>
                                 </td>
                                 <td className="px-10 py-6 font-mono text-[11px] text-slate-500">{log.endpoint}</td>
                                 <td className="px-10 py-6">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${log.status >= 400 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                       {log.status}
                                    </span>
                                 </td>
                                 <td className="px-10 py-6 text-right font-black text-slate-400 text-[11px]">{log.latency}ms</td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                      <span className="material-symbols-outlined text-rose-500 text-lg">warning</span>
                      Traffic Alerts
                   </h3>
                   <div className="space-y-4">
                      <div className="p-5 bg-rose-50 border border-rose-100 rounded-3xl">
                         <p className="text-[9px] font-black text-rose-600 uppercase mb-1">Burst detected</p>
                         <p className="text-xs font-bold text-rose-900 leading-tight">App APP-771 reached 90% of per-minute limit.</p>
                         <p className="text-[9px] text-rose-400 mt-2 font-mono">2024-03-25 15:45:01 • THROTTLED</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Regional Load</h3>
                   <div className="space-y-6">
                      {[
                        { region: 'South East Asia', load: 72, color: 'bg-indigo-500' },
                        { region: 'European Union', load: 18, color: 'bg-blue-400' },
                        { region: 'North America', load: 10, color: 'bg-slate-300' }
                      ].map(r => (
                        <div key={r.region} className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase">
                              <span>{r.region}</span>
                              <span>{r.load}%</span>
                           </div>
                           <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                              <div className={`h-full ${r.color}`} style={{ width: `${r.load}%` }} />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Tab 3: API Documentation */}
        {activeTab === 'DOCS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
             <div className="lg:col-span-4 space-y-6 h-fit sticky top-24">
                <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">API Resources</h3>
                   <div className="space-y-2">
                      {[
                        { icon: 'vpn_key', label: 'Authentication' },
                        { icon: 'list_alt', label: 'Ledger Queries' },
                        { icon: 'account_balance_wallet', label: 'Wallet Context' },
                        { icon: 'add_box', label: 'Value Entry (TEE)' },
                        { icon: 'verified', label: 'Validation Bridge' }
                      ].map(res => (
                        <button key={res.label} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-indigo-50 text-slate-700 transition-all border border-transparent hover:border-indigo-100 group">
                           <div className="flex items-center gap-4">
                              <span className="material-symbols-outlined text-xl opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all">{res.icon}</span>
                              <span className="text-xs font-black uppercase tracking-tight">{res.label}</span>
                           </div>
                           <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                        </button>
                      ))}
                   </div>
                </div>
                <div className="p-8 bg-ivory-surface/50 border border-ivory-border rounded-[40px] text-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Integrity Disclaimer</p>
                   <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                      "API Documentation is dynamically generated from current Protocol RuleSet v4.4.0. Offline nodes may lag by one cycle."
                   </p>
                </div>
             </div>
             
             <div className="lg:col-span-8">
                <div className="bg-white border border-ivory-border rounded-[48px] p-12 shadow-sm space-y-12 min-h-[600px]">
                   <div className="flex justify-between items-start">
                      <div>
                         <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Endpoint: /v1/records/create</h3>
                         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Protocol standard for remote value logging</p>
                      </div>
                      <div className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Restricted Scope</div>
                   </div>

                   <div className="prose prose-slate max-w-none">
                      <div className="p-8 bg-slate-900 border border-white/5 rounded-[32px] font-mono text-[12px] text-emerald-400/90 leading-relaxed overflow-x-auto shadow-inner">
                        {`# Request Headers
Authorization: Bearer <API_KEY>
X-UVFL-SIGNATURE: <HMAC_SHA256(payload, secret)>

# POST Body
{
  "amount": 2500,
  "asset": "USDT",
  "proof_hash": "sha256:7f8a...e91c",
  "metadata": {
    "device_id": "TEE-VN-002",
    "origin_iso": "VN"
  }
}

# Success Response (201 Created)
{
  "record_id": "REC-0xAB2F",
  "state": "CREATE",
  "ledger_hash": "sha256:902a...f912",
  "payout_estimate": 750.0
}`}
                      </div>
                   </div>

                   <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[40px] flex items-start gap-6">
                      <div className="size-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
                         <span className="material-symbols-outlined">science</span>
                      </div>
                      <div>
                         <p className="text-sm font-black text-indigo-900 uppercase mb-2">Sandbox Mirroring Active</p>
                         <p className="text-xs text-indigo-700 font-medium leading-relaxed italic">
                            "Sử dụng endpoint 'https://sandbox.uvfl.io/v1' để giả lập các giao dịch. Môi trường này không yêu cầu phí Token thật và dữ liệu sẽ được reset sau mỗi chu kỳ (24h)."
                         </p>
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

export default DeveloperPlatform;
