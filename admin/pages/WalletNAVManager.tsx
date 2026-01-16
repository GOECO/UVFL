
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../App';
import { walletNavService, UserWallet, SystemReserve } from '../../services/wallet-nav';
import { assetEngineService, FXSnapshot } from '../../services/asset-engine';

const WalletNAVManager = () => {
  const { t } = useLanguage();
  const fxSnapshots = useMemo(() => assetEngineService.getSnapshots(), []);
  const activeSnapshot = fxSnapshots[0];
  
  const userWallets = useMemo(() => walletNavService.getUserWallets(), []);
  const systemWallets = useMemo(() => walletNavService.getSystemWallets(), []);
  const navHistory = useMemo(() => walletNavService.getNAVHistory(), []);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredWallets = useMemo(() => 
    userWallets.filter(w => w.userId.toLowerCase().includes(searchTerm.toLowerCase()) || w.userName.toLowerCase().includes(searchTerm.toLowerCase())),
  [userWallets, searchTerm]);

  const globalStats = useMemo(() => {
    const userNAV = userWallets.reduce((sum, w) => sum + walletNavService.calculateNAV(w.balances, activeSnapshot), 0);
    const systemNAV = systemWallets.reduce((sum, s) => sum + walletNavService.calculateNAV(s.balances, activeSnapshot), 0);
    return {
      total: userNAV + systemNAV,
      user: userNAV,
      system: systemNAV,
      reconciled: true
    };
  }, [userWallets, systemWallets, activeSnapshot]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Top Global NAV Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-slate-900 text-white rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
           <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Total Asset Value (System NAV)</p>
                 <h2 className="text-6xl font-black tracking-tighter text-amber-400">
                    {globalStats.total.toLocaleString()} <span className="text-2xl text-white/30">V</span>
                 </h2>
              </div>
              <div className="mt-10 flex items-center gap-4">
                 <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <span className="text-[10px] font-black uppercase">Ledger Reconciled</span>
                 </div>
                 <span className="text-[10px] font-mono text-white/30 uppercase">Last Sync: Just now</span>
              </div>
           </div>
           <div className="absolute -bottom-24 -right-24 size-80 bg-amber-500/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
        </div>

        <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm flex flex-col justify-between">
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Asset Distribution</p>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                       <span className="text-slate-500">User Assets</span>
                       <span className="text-slate-900">{(globalStats.user / globalStats.total * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${(globalStats.user / globalStats.total * 100)}%` }}></div>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                       <span className="text-slate-500">System Liquidity</span>
                       <span className="text-slate-900">{(globalStats.system / globalStats.total * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-amber-500" style={{ width: `${(globalStats.system / globalStats.total * 100)}%` }}></div>
                    </div>
                 </div>
              </div>
           </div>
           <button className="w-full mt-8 py-3 border border-ivory-border text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
              Export Audit Snapshot
           </button>
        </div>

        <div className="bg-emerald-600 text-white rounded-[48px] p-8 shadow-xl relative overflow-hidden group">
           <div className="relative z-10">
              <span className="material-symbols-outlined text-4xl mb-6">security_update_good</span>
              <h4 className="text-lg font-black tracking-tight mb-2 uppercase leading-none text-white">Non-Manipulative Data</h4>
              <p className="text-xs text-white/70 font-medium leading-relaxed italic">
                 "Toán học hạch toán của UVFL đảm bảo NAV không thể bị can thiệp bởi quản trị viên. Mọi biến động số dư phải có bằng chứng Ledger đi kèm."
              </p>
           </div>
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-8xl">lock</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Wallet Explorer */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                 <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                   <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                   User Wallet Explorer
                 </h3>
                 <div className="relative w-full md:w-80">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">search</span>
                    <input 
                      type="text" 
                      placeholder="Search User ID or Name..."
                      className="w-full bg-slate-50 border border-ivory-border rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none focus:ring-4 ring-primary/5 transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 {filteredWallets.map(wallet => (
                   <div key={wallet.userId} className="p-8 border border-ivory-border rounded-[32px] hover:shadow-xl hover:bg-ivory-surface/20 transition-all group">
                      <div className="flex flex-col md:flex-row justify-between gap-8">
                         <div className="flex-1">
                            <div className="flex items-center gap-4 mb-6">
                               <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20">
                                  {wallet.userName.charAt(0)}
                               </div>
                               <div>
                                  <h4 className="font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">{wallet.userName}</h4>
                                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{wallet.userId} • REGION: {wallet.countryIso}</p>
                               </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                               {wallet.balances.map(b => (
                                 <div key={b.asset} className="bg-white/60 p-3 rounded-2xl border border-ivory-border/50">
                                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">{b.asset}</p>
                                    <p className="text-xs font-black text-slate-900">{b.available.toLocaleString()} <span className="text-[9px] opacity-40 font-bold">{b.currency}</span></p>
                                    {b.locked > 0 && <p className="text-[8px] font-bold text-rose-500 mt-1 uppercase">Locked: {b.locked}</p>}
                                 </div>
                               ))}
                            </div>
                         </div>
                         <div className="md:w-48 text-right flex flex-col justify-between border-l border-ivory-border pl-8">
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">User NAV (V)</p>
                               <p className="text-2xl font-black text-primary tracking-tighter">
                                 {walletNavService.calculateNAV(wallet.balances, activeSnapshot).toLocaleString()}
                               </p>
                            </div>
                            <button className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center justify-end gap-2 hover:gap-3 transition-all mt-4">
                               View Ledger
                               <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar: System Liquidity & History */}
        <div className="lg:col-span-4 space-y-8">
           
           <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">account_balance</span>
                System Reserves
              </h3>
              <div className="space-y-6">
                 {systemWallets.map(sys => (
                   <div key={sys.fundName} className="p-6 bg-slate-50 border border-ivory-border rounded-3xl">
                      <h4 className="text-xs font-black text-slate-900 mb-4 uppercase tracking-tight">{sys.fundName}</h4>
                      <div className="space-y-3">
                         {sys.balances.map(b => (
                           <div key={b.asset} className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-500">{b.asset}</span>
                              <span className="font-black text-slate-900">{b.available.toLocaleString()} {b.currency}</span>
                           </div>
                         ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-ivory-border flex justify-between items-baseline">
                         <span className="text-[9px] font-black text-slate-400 uppercase">Valuation (V)</span>
                         <span className="text-lg font-black text-amber-600">{walletNavService.calculateNAV(sys.balances, activeSnapshot).toLocaleString()}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900 rounded-[48px] p-8 text-white shadow-xl relative overflow-hidden group">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-8">NAV History (24h Blocks)</h3>
              <div className="space-y-6 relative z-10">
                 {navHistory.map((h, i) => (
                   <div key={i} className="flex items-center justify-between group/item">
                      <div>
                         <p className="text-[10px] font-black text-white/40 mb-1">{h.timestamp}</p>
                         <p className="text-sm font-black tracking-tight">{h.totalNAV.toLocaleString()} <span className="text-[10px] opacity-30 italic font-medium">V</span></p>
                      </div>
                      <span className="material-symbols-outlined text-emerald-400 text-sm opacity-20 group-hover/item:opacity-100 transition-opacity">verified</span>
                   </div>
                 ))}
              </div>
              <div className="absolute -bottom-10 -right-10 size-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
           </div>

           <div className="bg-ivory-surface border border-ivory-border rounded-[40px] p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">rebase_edit</span>
              <h4 className="text-xs font-black text-slate-900 uppercase mb-2">Reconciliation Principle</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">
                "NAV = Σ(User Assets) + Σ(System Reserves). Nếu xảy ra sai lệch thù lao, thuật toán AI-13 sẽ tự động kích hoạt Emergency Freeze."
              </p>
           </div>

        </div>
      </div>
    </div>
  );
};

export default WalletNAVManager;
