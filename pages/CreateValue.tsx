
import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../App';
import { complianceService, TaxBreakdown } from '../services/compliance';
import { emergencyService } from '../services/emergency';

const CreateValue = () => {
  const { t, locale } = useLanguage();
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('USDT');
  const [hsCode, setHsCode] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  
  const emergency = emergencyService.getEmergencyState();

  // Mock Country Config
  const countryConfig = {
    vatRate: 10,
    dutyRate: 5,
    withholdingRate: 5,
    customsThreshold: 1000,
    currency: asset === 'NATIONAL' ? 'VND' : asset
  };

  const breakdown = useMemo(() => {
    const val = parseFloat(amount) || 0;
    return complianceService.calculateEstimate(val, asset, countryConfig, hsCode);
  }, [amount, asset, hsCode]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-10 my-12 animate-in fade-in duration-500">
      
      {/* Emergency Warning */}
      {emergency.isFrozen && (
        <div className="mb-10 bg-rose-50 border-2 border-rose-200 p-8 rounded-[40px] flex items-center gap-6 animate-pulse">
           <span className="material-symbols-outlined text-rose-500 text-5xl">lock_clock</span>
           <div>
              <h3 className="text-rose-900 font-black uppercase tracking-tight">Hệ thống đang tạm ngừng (Frozen)</h3>
              <p className="text-rose-700 text-sm font-medium leading-relaxed italic">
                Cơ chế tạo bản ghi hiện đang tạm khóa để bảo trì bảo mật. Vui lòng quay lại sau.
              </p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Form Section */}
        <div className={`lg:col-span-3 bg-white rounded-[40px] shadow-2xl border border-ivory-border p-8 relative overflow-hidden transition-opacity ${emergency.isFrozen ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-9xl">gavel</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">add_box</span>
            {t.create.title}
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{t.create.assetType}</label>
                <select 
                  className="w-full bg-ivory-surface border-ivory-border rounded-xl p-3 outline-none text-slate-800 font-bold appearance-none cursor-pointer text-sm"
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  disabled={emergency.isFrozen}
                >
                  <option value="USDT">USDT (Stable)</option>
                  <option value="GOLD">GOLD (Grams)</option>
                  <option value="NATIONAL">NATIONAL (VND)</option>
                  <option value="REWARD">REWARD</option>
                </select>
              </div>
              <div className="col-span-1">
                 <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">HS Code (Optional)</label>
                 <input 
                  type="text"
                  placeholder="e.g. 7108"
                  className="w-full bg-ivory-surface border-ivory-border rounded-xl p-3 text-sm font-bold text-slate-800 outline-none"
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                  disabled={emergency.isFrozen}
                 />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{t.create.amount}</label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full bg-ivory-surface border-ivory-border rounded-2xl p-5 text-3xl font-black text-slate-900 tracking-tighter outline-none"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={emergency.isFrozen}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">{asset}</span>
              </div>
            </div>

            <button 
              disabled={emergency.isFrozen}
              className="w-full bg-primary hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:bg-slate-400 disabled:shadow-none"
            >
              <span>{emergency.isFrozen ? 'SYSTEM LOCKED' : t.create.submit}</span>
              <span className="material-symbols-outlined">{emergency.isFrozen ? 'lock' : 'send'}</span>
            </button>
          </div>
        </div>

        {/* Compliance Estimation Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Compliance Estimate</span>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{t.create.taxEstimate}</p>
                <h3 className="text-4xl font-black tracking-tighter">
                  {breakdown.totalTax.toLocaleString()} <span className="text-lg text-white/30 font-bold">{breakdown.currency}</span>
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60 font-medium">VAT / GST ({countryConfig.vatRate}%)</span>
                  <span className="font-bold">{breakdown.vat.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full mt-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                {showDetails ? 'Hide' : 'View'} Mapping Details
              </button>
            </div>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-[32px] relative overflow-hidden">
            <div className="flex gap-4 relative z-10">
              <span className="material-symbols-outlined text-amber-500 shrink-0">info</span>
              <p className="text-[11px] text-amber-800 font-medium leading-relaxed italic">
                {complianceService.getDisclaimer(locale as 'vi' | 'en')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateValue;
