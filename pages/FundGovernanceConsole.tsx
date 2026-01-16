
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../App';
import { fundGovernanceService, FundTransaction, FundCategory, FundStats } from '../services/fund-governance';

const CategoryBadge = ({ category }: { category: FundCategory }) => {
  const styles: any = {
    DEVELOPMENT: 'bg-blue-100 text-blue-700',
    RISK_RESERVE: 'bg-rose-100 text-rose-700',
    COMMUNITY: 'bg-emerald-100 text-emerald-700',
    LEGAL: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${styles[category]}`}>
      {category.replace('_', ' ')}
    </span>
  );
};

const FundGovernanceConsole = () => {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<FundTransaction[]>(fundGovernanceService.getTransactions());
  const stats = useMemo(() => fundGovernanceService.getStats(transactions), [transactions]);

  const [newOutflow, setNewOutflow] = useState({
    amount: 0,
    category: 'DEVELOPMENT' as FundCategory,
    justification: '',
  });

  const handleAddOutflow = () => {
    if (newOutflow.amount <= 0 || !newOutflow.justification) return;
    
    // Check limit
    if (stats.categoryAllocation[newOutflow.category] < newOutflow.amount) {
      alert("CẢNH BÁO: Khoản chi vượt quá ngân sách khả dụng của danh mục này!");
      return;
    }

    const tx: FundTransaction = {
      id: `FTX-${Date.now()}`,
      type: 'OUTFLOW',
      category: newOutflow.category,
      amount: newOutflow.amount,
      justification: newOutflow.justification,
      rulesetVersion: '4.4.0',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      auditRef: 'sha256:manual_' + Math.random().toString(16).slice(2, 10)
    };

    setTransactions([tx, ...transactions]);
    setNewOutflow({ amount: 0, category: 'DEVELOPMENT', justification: '' });
  };

  const handleExport = () => {
    const report = fundGovernanceService.generateReport(stats, transactions);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UVFL_Fund_Report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Balance Card */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">Fund Governance Console</h1>
          <p className="text-slate-500 font-medium italic">Minh bạch hóa dòng thù lao hệ thống và quỹ dự phòng.</p>
        </div>
        <div className="bg-slate-900 text-white rounded-[32px] p-8 shadow-2xl flex items-center gap-10 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Tổng Số Dư Quỹ (V)</p>
            <h2 className="text-5xl font-black tracking-tighter text-amber-400">{stats.totalBalance.toLocaleString()}</h2>
          </div>
          <div className="relative z-10 flex gap-4 border-l border-white/10 pl-10">
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase mb-1">Inflow</p>
              <p className="text-lg font-black text-emerald-400">+{stats.inflowTotal.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase mb-1">Outflow</p>
              <p className="text-lg font-black text-rose-400">-{stats.outflowTotal.toLocaleString()}</p>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 size-40 bg-amber-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Breakdown & Outflow Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Phân bổ theo Danh mục</h3>
             <div className="space-y-6">
                {(Object.keys(stats.categoryAllocation) as FundCategory[]).map(cat => {
                   const value = stats.categoryAllocation[cat];
                   const limit = stats.categoryLimits[cat];
                   const percent = Math.min((value / limit) * 100, 100);
                   return (
                     <div key={cat} className="space-y-2">
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] font-black text-slate-700 uppercase">{cat.replace('_', ' ')}</span>
                           <span className="text-xs font-black">{value.toLocaleString()} <span className="text-[10px] text-slate-400">/ {limit.toLocaleString()}</span></span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div 
                            className={`h-full transition-all duration-700 ${value < 0 ? 'bg-rose-500' : 'bg-primary'}`} 
                            style={{ width: `${Math.abs(percent)}%` }} 
                           />
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>

          <div className="bg-ivory-surface border border-ivory-border rounded-[40px] p-8">
             <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">outbound</span>
               Đề xuất Chi quỹ (Outflow)
             </h3>
             <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[9px] font-black text-slate-400 uppercase">Danh mục</label>
                   <select 
                    value={newOutflow.category}
                    onChange={(e) => setNewOutflow({...newOutflow, category: e.target.value as FundCategory})}
                    className="w-full bg-white border border-ivory-border rounded-xl px-4 py-2 text-xs font-bold outline-none"
                   >
                     <option value="DEVELOPMENT">DEVELOPMENT</option>
                     <option value="RISK_RESERVE">RISK RESERVE</option>
                     <option value="COMMUNITY">COMMUNITY</option>
                     <option value="LEGAL">LEGAL</option>
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black text-slate-400 uppercase">Số lượng (V)</label>
                   <input 
                    type="number"
                    value={newOutflow.amount}
                    onChange={(e) => setNewOutflow({...newOutflow, amount: Number(e.target.value)})}
                    className="w-full bg-white border border-ivory-border rounded-xl px-4 py-2 text-xs font-bold outline-none"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black text-slate-400 uppercase">Lý do khai báo (Justification)</label>
                   <textarea 
                    value={newOutflow.justification}
                    onChange={(e) => setNewOutflow({...newOutflow, justification: e.target.value})}
                    placeholder="VD: Chi trả phí hạ tầng AWS tháng 3..."
                    className="w-full bg-white border border-ivory-border rounded-xl px-4 py-2 text-xs font-bold outline-none min-h-[80px]"
                   />
                </div>
                <button 
                  onClick={handleAddOutflow}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors"
                >
                  Xác nhận Chi Quỹ
                </button>
             </div>
          </div>
        </div>

        {/* Transaction Timeline & Ledger */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white border border-ivory-border rounded-[48px] overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-ivory-border flex justify-between items-center">
                 <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                   <span className="material-symbols-outlined text-amber-500">list_alt</span>
                   Lịch sử Sổ cái Quỹ (Fund Ledger)
                 </h3>
                 <button 
                  onClick={handleExport}
                  className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center gap-2"
                 >
                    <span className="material-symbols-outlined text-sm">download_for_offline</span>
                    Export Audit Report
                 </button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-ivory-surface/50 border-b border-ivory-border">
                       <tr>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giao dịch</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá trị</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lý do / Mô tả</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Reference</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-ivory-border">
                       {transactions.map(tx => (
                         <tr key={tx.id} className="group hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5">
                               <p className="text-xs font-black text-slate-900 tracking-tight uppercase">{tx.id}</p>
                               <p className="text-[9px] font-bold text-slate-400">{tx.timestamp}</p>
                            </td>
                            <td className="px-8 py-5">
                               <div className="flex flex-col gap-1">
                                  <span className={`w-fit px-1.5 py-0.5 rounded text-[8px] font-black ${tx.type === 'INFLOW' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                     {tx.type}
                                  </span>
                                  <CategoryBadge category={tx.category} />
                               </div>
                            </td>
                            <td className="px-8 py-5">
                               <p className={`text-sm font-black ${tx.type === 'INFLOW' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {tx.type === 'INFLOW' ? '+' : '-'}{tx.amount.toLocaleString()} V
                               </p>
                            </td>
                            <td className="px-8 py-5">
                               <p className="text-[11px] text-slate-600 font-medium leading-relaxed max-w-[250px]">
                                  {tx.justification || 'Phân bổ tự động từ RuleEngine v' + tx.rulesetVersion}
                               </p>
                            </td>
                            <td className="px-8 py-5 text-right">
                               <a 
                                href={`#/explorer?hash=${tx.auditRef}`}
                                className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-primary hover:underline"
                               >
                                  {tx.auditRef.substring(0, 12)}...
                                  <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                               </a>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* AI Foresight on Fund Health */}
           <div className="bg-slate-900 rounded-[48px] p-8 text-white flex items-start gap-6">
              <div className="size-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                 <span className="material-symbols-outlined text-2xl">monitoring</span>
              </div>
              <div>
                 <h4 className="text-sm font-black text-amber-400 uppercase tracking-tight mb-2">Phân tích Sức khỏe Quỹ (AI-12 Forecast)</h4>
                 <p className="text-xs text-white/60 font-medium leading-relaxed italic">
                   "Dựa trên dòng thù lao hiện tại, Quỹ rủi ro (Risk Reserve) sẽ đạt ngưỡng mục tiêu 100k V trong 14 ngày tới. Tốc độ chi tiêu cho Phát triển (Development) đang ở mức an toàn (15% ngân sách). Khuyến nghị: Tăng phân bổ cho Community Support để thúc đẩy các nút Mesh khu vực Đông Nam Á."
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default FundGovernanceConsole;
