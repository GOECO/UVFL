
import React, { useState } from 'react';
import { useLanguage } from '../App';

const CreateValue = () => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('USDT');

  return (
    <div className="max-w-2xl mx-auto p-10 bg-white my-12 rounded-[40px] shadow-2xl border border-emerald-50">
      <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">{t.create.title}</h2>
      
      <div className="space-y-8">
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">{t.create.assetType}</label>
          <select 
            className="w-full bg-gray-50 border-gray-100 rounded-[20px] p-5 focus:ring-4 ring-emerald-100 outline-none text-slate-800 font-bold appearance-none cursor-pointer"
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
          >
            <option value="USDT">USDT (Stablecoin)</option>
            <option value="GOLD">GOLD (Grams)</option>
            <option value="NATIONAL">NATIONAL CURRENCY</option>
            <option value="REWARD">REWARD TOKEN</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">{t.create.amount}</label>
          <input 
            type="number" 
            placeholder="0.00"
            className="w-full bg-gray-50 border-none rounded-[20px] p-6 text-4xl font-black text-slate-900 tracking-tighter focus:ring-4 ring-emerald-100 outline-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="bg-emerald-50 p-6 rounded-[24px] border border-emerald-100">
          <p className="text-[10px] font-black text-emerald-600 uppercase mb-2 tracking-widest">{t.create.taxEstimate}</p>
          <p className="text-3xl font-black text-emerald-900 tracking-tighter">
            {amount ? (parseFloat(amount) * 0.1).toFixed(2) : "0.00"} <span className="text-lg opacity-50">{asset}</span>
          </p>
          <p className="text-[11px] text-emerald-600 mt-4 italic font-medium opacity-70 leading-relaxed">
            {t.create.disclaimer}
          </p>
        </div>

        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-6 rounded-[20px] text-lg shadow-xl shadow-emerald-200 transition-all active:scale-95">
          {t.create.submit}
        </button>
      </div>
    </div>
  );
};

export default CreateValue;
