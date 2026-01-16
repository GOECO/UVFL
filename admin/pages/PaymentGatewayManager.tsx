
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../App';
import { paymentGatewayService, PaymentProvider, RampRule, TransactionLog } from '../../services/payment-gateway';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    MAINTENANCE: 'bg-amber-100 text-amber-700',
    DISABLED: 'bg-rose-100 text-rose-700',
    COMPLETED: 'bg-emerald-50 text-emerald-600',
    PENDING: 'bg-blue-50 text-blue-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${styles[status]}`}>
      {status}
    </span>
  );
};

const PaymentGatewayManager = () => {
  const { t } = useLanguage();
  const [country, setCountry] = useState('VN');
  
  const providers = useMemo(() => paymentGatewayService.getProviders(country), [country]);
  const rules = useMemo(() => paymentGatewayService.getRampRules(country), [country]);
  const logs = useMemo(() => paymentGatewayService.getTransactionLogs(), []);
  const performance = useMemo(() => paymentGatewayService.getProviderPerformance(), []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Policy Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-xl border border-white/5 flex items-center gap-6 relative overflow-hidden group">
           <div className="size-16 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <span className="material-symbols-outlined text-4xl">policy</span>
           </div>
           <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-1">KYC/AML Enforcement</h4>
              <p className="text-xs text-white/60 font-medium italic leading-relaxed">
                Mọi giao dịch On/Off Ramp được giám sát bởi AI-13. Các giao dịch vượt ngưỡng 100k V được báo cáo tự động cho bộ phận tuân thủ.
              </p>
           </div>
           <div className="absolute -bottom-10 -right-10 size-40 bg-primary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-[40px] p-8 flex items-center gap-6 shadow-sm">
           <div className="size-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <span className="material-symbols-outlined text-4xl">warning</span>
           </div>
           <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-amber-700 mb-1">Asset Constraints</h4>
              <p className="text-xs text-amber-800 font-medium italic leading-relaxed">
                REWARD_TOKEN không được phép On/Off ramp. GOLD chỉ được ghi nhận giá trị hạch toán (Value-only), không giao nhận vật chất qua cổng thanh toán.
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Gateway List & Performance */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                   <span className="material-symbols-outlined text-primary">account_balance</span>
                   Payment Gateways: {country}
                 </h3>
                 <select 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-slate-50 border border-ivory-border rounded-xl px-4 py-2 text-xs font-black outline-none"
                 >
                    <option value="VN">Vietnam (VN)</option>
                    <option value="SG">Singapore (SG)</option>
                    <option value="DE">Germany (DE)</option>
                 </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {providers.map(p => (
                   <div key={p.id} className="p-6 bg-slate-50 border border-ivory-border rounded-[32px] hover:shadow-xl hover:bg-white transition-all group relative">
                      <div className="flex justify-between items-start mb-6">
                         <div className={`size-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                           p.type === 'BANK' ? 'bg-blue-600' : p.type === 'CRYPTO' ? 'bg-orange-500' : 'bg-emerald-500'
                         }`}>
                           <span className="material-symbols-outlined">
                              {p.type === 'BANK' ? 'account_balance' : p.type === 'CRYPTO' ? 'currency_bitcoin' : 'account_balance_wallet'}
                           </span>
                         </div>
                         <StatusBadge status={p.status} />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mb-2">{p.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">ID: {p.id}</p>
                      
                      <div className="space-y-2 border-t border-slate-100 pt-4">
                         <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-400 uppercase tracking-tighter">System Fee</span>
                            <span className="text-slate-900">{p.fee.system}%</span>
                         </div>
                         <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-400 uppercase tracking-tighter">Provider Fee</span>
                            <span className="text-slate-900">{p.fee.provider}%</span>
                         </div>
                      </div>
                      <button className="mt-6 w-full py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                         Configure Limits
                      </button>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
              <div className="px-10 py-8 border-b border-ivory-border flex justify-between items-center bg-ivory-surface/20">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Live Transaction Audit Log</h3>
                 <button className="text-xs font-black text-primary uppercase flex items-center gap-2">
                    View Full History
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                 </button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-ivory-surface/50 border-b border-ivory-border">
                       <tr>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / User</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Hash</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-ivory-border">
                       {logs.map(log => (
                         <tr key={log.id} className="group hover:bg-slate-50 transition-colors">
                            <td className="px-10 py-6">
                               <p className="text-xs font-black text-slate-900 mb-1">{log.id}</p>
                               <p className="text-[10px] font-bold text-slate-400">{log.userId}</p>
                            </td>
                            <td className="px-10 py-6">
                               <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                                 log.type === 'DEPOSIT' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                               }`}>
                                  {log.type}
                               </span>
                               <p className="text-[9px] font-bold text-slate-400 mt-1">{log.providerId}</p>
                            </td>
                            <td className="px-10 py-6">
                               <p className="text-sm font-black text-slate-900">{log.amount.toLocaleString()} <span className="text-[10px] opacity-40">{log.currency}</span></p>
                               <p className="text-[9px] text-slate-400 font-bold tracking-tight">Fee: {log.totalFee.toLocaleString()} {log.currency}</p>
                            </td>
                            <td className="px-10 py-6">
                               <StatusBadge status={log.status} />
                            </td>
                            <td className="px-10 py-6 text-right font-mono text-[9px] text-slate-400 uppercase">
                               {log.auditHash.substring(0, 15)}...
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Rules & Limits Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           
           <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                 <span className="material-symbols-outlined text-rose-500">lock_open</span>
                 Limits by KYC Level (VN)
              </h3>
              <div className="space-y-6">
                 {rules.map(rule => (
                   <div key={rule.kycLevel} className="p-5 bg-slate-50 border border-ivory-border rounded-3xl relative">
                      <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded">LEVEL {rule.kycLevel}</div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Daily Limit</p>
                            <p className="text-sm font-black text-slate-900">${rule.dailyLimit.toLocaleString()}</p>
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Monthly</p>
                            <p className="text-sm font-black text-slate-900">${rule.monthlyLimit.toLocaleString()}</p>
                         </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-ivory-border flex justify-between items-center">
                         <span className="text-[9px] font-bold text-slate-400">Manual Approval</span>
                         <span className={`text-[9px] font-black ${rule.requireApproval ? 'text-amber-600' : 'text-emerald-600'}`}>
                           {rule.requireApproval ? 'REQUIRED' : 'AUTO-PROCESS'}
                         </span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined">analytics</span>
                    Provider Performance
                 </h4>
                 <div className="space-y-8">
                    {performance.map((item: any, i: number) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between items-baseline">
                            <span className="text-xs font-bold text-white/80">{item.provider}</span>
                            <span className="text-[10px] font-black text-emerald-400">{item.successRate}% OK</span>
                         </div>
                         <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${item.successRate}%` }} />
                         </div>
                         <div className="flex justify-between text-[8px] font-black text-white/30 uppercase">
                            <span>Vol: ${item.volume.toLocaleString()}</span>
                            <span>Avg: {item.avgTime}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 size-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
           </div>

           <div className="bg-ivory-surface border border-ivory-border rounded-[40px] p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">help_outline</span>
              <h4 className="text-xs font-black text-slate-900 uppercase mb-2">Need to add a provider?</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                 Gửi yêu cầu tích hợp API tới bộ phận Ops. Phê duyệt bởi AI-17 (Standardization) là bắt buộc.
              </p>
           </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayManager;
