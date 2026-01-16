
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../App';
import { aiGatewayService, AIProvider, AIUsageRecord, PromptTemplate, BudgetLimit, RoutingRule } from '../../services/ai-gateway';

const AIGatewayManager = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'CONTROL' | 'PROMPTS' | 'FINANCE' | 'SAFETY'>('CONTROL');
  
  const providers = useMemo(() => aiGatewayService.getProviders(), []);
  const rules = useMemo(() => aiGatewayService.getRoutingRules(), []);
  const budgets = useMemo(() => aiGatewayService.getBudgets(), []);
  const logs = useMemo(() => aiGatewayService.getUsageLogs(), []);
  const templates = useMemo(() => aiGatewayService.getTemplates(), []);

  const totalCost = useMemo(() => logs.reduce((sum, l) => sum + l.cost, 0), [logs]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header & Global Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">AI Proxy Layer</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">UNIFIED_GATEWAY_v2 // AGNOSTIC_ROUTING</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase">AI Gateway Console</h1>
          <p className="text-slate-500 font-medium italic">Quản trị cổng trung gian, định tuyến tài nguyên và kiểm soát chi phí trí tuệ nhân tạo.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-ivory-border rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4">
              <div className="size-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                 <span className="material-symbols-outlined">analytics</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">MTD Spend</p>
                 <p className="text-xl font-black text-slate-900">${totalCost.toFixed(4)}</p>
              </div>
           </div>
           <div className="bg-white border border-ivory-border rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4">
              <div className="size-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                 <span className="material-symbols-outlined">bolt</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Avg Performance</p>
                 <p className="text-xl font-black text-indigo-600">420ms</p>
              </div>
           </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-ivory-border gap-8 overflow-x-auto scrollbar-hide">
        {[
          { id: 'CONTROL', label: 'Control Room', icon: 'settings_input_component' },
          { id: 'PROMPTS', label: 'Prompt Vault', icon: 'terminal' },
          { id: 'FINANCE', label: 'Cost & Forecast', icon: 'payments' },
          { id: 'SAFETY', label: 'Safety & PII', icon: 'shield_person' }
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
        
        {/* Tab 1: Control Room (Health & Routing) */}
        {activeTab === 'CONTROL' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
             <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Provider Health</h3>
                   <div className="space-y-4">
                      {providers.map(p => (
                        <div key={p.id} className="p-4 bg-slate-50 border border-ivory-border rounded-2xl flex justify-between items-center">
                           <div>
                              <p className="text-xs font-black text-slate-900">{p.name}</p>
                              <p className="text-[9px] font-mono text-slate-400 uppercase">{p.id} • {p.latency}ms</p>
                           </div>
                           <span className={`size-2 rounded-full ${p.status === 'ONLINE' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`} />
                        </div>
                      ))}
                   </div>
                </div>
                <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                   <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6">Traffic Distribution</h4>
                   <div className="space-y-4 relative z-10">
                      <div className="flex justify-between text-[10px] font-bold">
                         <span>Google Gemini</span>
                         <span>72%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 w-[72%]" />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                         <span>OpenAI</span>
                         <span>24%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-400 w-[24%]" />
                      </div>
                   </div>
                   <div className="absolute -bottom-10 -right-10 size-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                </div>
             </div>
             
             <div className="lg:col-span-8">
                <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
                   <div className="px-10 py-8 border-b border-ivory-border bg-ivory-surface/20 flex justify-between items-center">
                      <h3 className="text-sm font-black uppercase tracking-widest">Active Routing Rules</h3>
                      <button className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Add New Policy</button>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-ivory-surface/50 border-b border-ivory-border">
                            <tr>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Task / Payload</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fallback</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Max Output</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-ivory-border">
                            {rules.map(r => (
                              <tr key={r.task} className="hover:bg-slate-50 transition-colors">
                                 <td className="px-10 py-6">
                                    <p className="text-sm font-black text-slate-900 tracking-tight">{r.task}</p>
                                 </td>
                                 <td className="px-10 py-6">
                                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">{r.primaryProvider}</span>
                                 </td>
                                 <td className="px-10 py-6">
                                    <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">{r.fallbackProvider}</span>
                                 </td>
                                 <td className="px-10 py-6 text-right font-mono text-xs font-bold text-slate-400">{r.maxTokens} tokens</td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Tab 2: Prompt Vault */}
        {activeTab === 'PROMPTS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
             <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">AI Agent Library (18 Total)</h3>
                   <div className="space-y-2">
                      {templates.map(t => (
                        <button key={t.agentId} className="w-full text-left p-4 rounded-2xl border border-ivory-border hover:bg-indigo-50 hover:border-indigo-100 transition-all flex justify-between items-center group">
                           <div>
                              <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">{t.agentId}</p>
                              <p className="text-sm font-black text-slate-800">{t.name}</p>
                           </div>
                           <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-400 transition-colors">chevron_right</span>
                        </button>
                      ))}
                      <div className="py-4 text-center opacity-30 italic text-xs">More agents loading...</div>
                   </div>
                </div>
             </div>
             <div className="lg:col-span-8">
                <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm space-y-8">
                   <div className="flex justify-between items-start">
                      <div>
                         <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Prompt Template Editor</h3>
                         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Version Control: v2.4.1 (Latest)</p>
                      </div>
                      <div className="flex gap-2">
                         <button className="px-6 py-2 bg-slate-50 border border-ivory-border rounded-xl text-[10px] font-black uppercase tracking-widest">Compare</button>
                         <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10">Deploy Standard</button>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Instruction (Read/Write)</label>
                      <textarea 
                        className="w-full bg-slate-50 border border-ivory-border rounded-[32px] p-8 text-sm font-mono font-medium text-slate-700 h-64 focus:ring-4 ring-primary/5 outline-none resize-none leading-relaxed"
                        defaultValue={templates[1].systemInstruction}
                      />
                   </div>
                   <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-6">
                      <span className="material-symbols-outlined text-emerald-500 text-3xl">verified_user</span>
                      <div>
                         <p className="text-xs font-black text-emerald-900 uppercase">Injection Shield Active</p>
                         <p className="text-[11px] text-emerald-700 font-medium italic">Gateway sẽ tự động append lớp bảo mật "Zero-Knowledge Constraint" vào cuối prompt này khi thực thi.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Tab 3: Finance (Cost & Forecast) */}
        {activeTab === 'FINANCE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
             <div className="lg:col-span-8 space-y-8">
                <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
                   <h3 className="text-lg font-black text-slate-900 mb-10 flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">monitoring</span>
                      AI Token Usage & Cost Breakdown
                   </h3>
                   <div className="space-y-8">
                      {/* Bar chart placeholder */}
                      <div className="flex items-end gap-12 h-64 border-b border-ivory-border pb-4">
                         {[
                           { day: '21 Mar', cost: 0.8, color: 'bg-slate-200' },
                           { day: '22 Mar', cost: 1.2, color: 'bg-slate-200' },
                           { day: '23 Mar', cost: 0.9, color: 'bg-slate-200' },
                           { day: '24 Mar', cost: 2.1, color: 'bg-slate-200' },
                           { day: 'Today', cost: 1.5, color: 'bg-primary' }
                         ].map((d, i) => (
                           <div key={i} className="flex-1 flex flex-col items-center gap-4">
                              <div className={`w-full rounded-t-xl transition-all duration-1000 ${d.color}`} style={{ height: `${(d.cost/2.5)*100}%` }} />
                              <p className="text-[9px] font-black text-slate-400 uppercase">{d.day}</p>
                           </div>
                         ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Forecast (Next 30d)</p>
                            <p className="text-2xl font-black text-slate-900">$1,450.00</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Avg Cost per Request</p>
                            <p className="text-2xl font-black text-slate-900">$0.0042</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Efficiency Ratio</p>
                            <p className="text-2xl font-black text-emerald-600">98.4%</p>
                         </div>
                      </div>
                   </div>
                </div>
                
                <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
                   <div className="px-10 py-8 border-b border-ivory-border bg-ivory-surface/20">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Unified Access Audit (Immutable)</h3>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="bg-ivory-surface/50 border-b border-ivory-border">
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time / Agent</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Task</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">I/O Tokens</th>
                               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Cost (USD)</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-ivory-border">
                            {logs.map((log, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition-colors">
                                 <td className="px-10 py-6">
                                    <p className="text-xs font-black text-slate-900 mb-1">{log.agentId}</p>
                                    <p className="text-[9px] font-mono text-slate-400">{log.timestamp}</p>
                                 </td>
                                 <td className="px-10 py-6 text-xs font-bold text-slate-500 uppercase">{log.task}</td>
                                 <td className="px-10 py-6 text-xs font-mono text-slate-400">{log.tokensIn} / {log.tokensOut}</td>
                                 <td className="px-10 py-6 text-right font-black text-slate-900">${log.cost.toFixed(4)}</td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Budget Quotas</h3>
                   <div className="space-y-8">
                      {budgets.map(b => (
                        <div key={b.targetId} className="space-y-2">
                           <div className="flex justify-between items-baseline">
                              <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{b.targetId}</span>
                              <span className="text-[10px] font-bold text-slate-400">${b.currentSpend} / ${b.dailyLimit}</span>
                           </div>
                           <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-1000 ${b.currentSpend/b.dailyLimit > 0.8 ? 'bg-rose-500' : 'bg-primary'}`} 
                                style={{ width: `${(b.currentSpend/b.dailyLimit)*100}%` }} 
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                   <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10">Adjust Quotas</button>
                </div>

                <div className="bg-amber-600 rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden group">
                   <div className="relative z-10">
                      <h4 className="text-sm font-black uppercase tracking-widest mb-6">Financial Safeguard</h4>
                      <p className="text-xs text-white/80 font-medium leading-relaxed italic">
                         "Hệ thống tự động ngắt kết nối Agent nếu chi phí vượt 110% ngân sách ngày để ngăn chặn vòng lặp AI (Infinite Loops)."
                      </p>
                   </div>
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <span className="material-symbols-outlined text-[100px]">lock_clock</span>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Tab 4: Safety & PII */}
        {activeTab === 'SAFETY' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
             <div className="lg:col-span-8">
                <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm space-y-10">
                   <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3">
                      <span className="material-symbols-outlined text-rose-600">security</span>
                      Data Scrubbing & PII Redaction
                   </h3>
                   <div className="space-y-6">
                      <div className="p-8 bg-slate-50 border border-ivory-border rounded-[32px] space-y-6">
                         <div className="flex justify-between items-center border-b border-ivory-border/50 pb-4">
                            <div>
                               <p className="text-sm font-black text-slate-900 uppercase">Automatic Masking Rules</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Applied before sending to Public Providers</p>
                            </div>
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase animate-pulse">Running</span>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                              { label: 'Email Addresses', status: 'MASKING_ON', pattern: 'regex:email' },
                              { label: 'Citizen IDs / Passport', status: 'MASKING_ON', pattern: 'regex:gov_id' },
                              { label: 'Phone Numbers', status: 'BYPASS_ALLOWED', pattern: 'regex:phone' },
                              { label: 'Ledger Hash Codes', status: 'ANONYMIZE', pattern: 'regex:sha256' }
                            ].map((rule, i) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-white border border-ivory-border rounded-2xl">
                                 <div>
                                    <p className="text-xs font-bold text-slate-700">{rule.label}</p>
                                    <code className="text-[9px] text-slate-400 font-mono">{rule.pattern}</code>
                                 </div>
                                 <span className={`text-[8px] font-black px-2 py-0.5 rounded ${rule.status.includes('ON') ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                                    {rule.status}
                                 </span>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Simulate Masking Logic</p>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <p className="text-[9px] font-bold text-slate-500">RAW PAYLOAD</p>
                               <div className="bg-slate-900 text-rose-300 p-4 rounded-xl text-[10px] font-mono leading-relaxed">
                                  "User Nguyen Van A (email: van.a@uvfl.io) created record ID-992102..."
                               </div>
                            </div>
                            <div className="space-y-2">
                               <p className="text-[9px] font-bold text-emerald-600">PROXY OUTPUT</p>
                               <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-[10px] font-mono leading-relaxed italic">
                                  "User Nguyen Van A (email: [EMAIL_MASKED]) created record [ID_MASKED]..."
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-6">
                <div className="bg-rose-600 rounded-[48px] p-8 text-white shadow-xl relative overflow-hidden group">
                   <div className="relative z-10">
                      <h4 className="text-sm font-black uppercase tracking-widest mb-6">Zero-Shot Privacy</h4>
                      <p className="text-xs text-white/80 font-medium leading-relaxed italic mb-8">
                         "AI Gateway đảm bảo rằng không bao giờ có dữ liệu thô nhạy cảm (Raw Sensitive Data) được gửi tới các máy chủ của OpenAI hoặc Google. Việc vi phạm quy trình này sẽ kích hoạt thu hồi Key Provider ngay lập tức."
                      </p>
                      <button className="w-full py-4 bg-white text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest">Test Privacy Bridge</button>
                   </div>
                   <div className="absolute -bottom-10 -right-10 size-40 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="bg-white border border-ivory-border rounded-[40px] p-8">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Content Filtering</h3>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                         <span className="font-bold text-slate-600">Malware Detection</span>
                         <span className="text-emerald-500 font-black">ENABLED</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                         <span className="font-bold text-slate-600">Financial Ethics</span>
                         <span className="text-emerald-500 font-black">ENABLED</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                         <span className="font-bold text-slate-600">Jailbreak Detection</span>
                         <span className="text-rose-500 font-black">ACTIVE</span>
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

export default AIGatewayManager;
